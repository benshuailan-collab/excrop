const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8" };

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...JSON_HEADERS, "Cache-Control": "no-store" }
  });
}

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ success: false, error: "Inquiry storage is not configured." }, 503);
  if (!env.IP_HASH_SALT) return json({ success: false, error: "Contact API security configuration is incomplete." }, 503);

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return json({ success: false, error: "Content-Type must be application/json." }, 415);
  }

  const length = Number(request.headers.get("content-length") || 0);
  if (length > 12000) return json({ success: false, error: "Request is too large." }, 413);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: "Invalid request body." }, 400);
  }

  // Honeypot: silently accept bot submissions without storing or notifying.
  if (typeof body.website === "string" && body.website.trim()) {
    return json({ success: true });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const pageUrl = typeof body.page_url === "string" ? body.page_url.slice(0, 1000) : "";

  if (name.length < 2 || name.length > 120) {
    return json({ success: false, error: "Please enter a name between 2 and 120 characters." }, 400);
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ success: false, error: "Please enter a valid email address." }, 400);
  }
  if (message.length > 5000) {
    return json({ success: false, error: "Message must be 5,000 characters or fewer." }, 400);
  }

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const ipHash = await sha256(ip + env.IP_HASH_SALT);
  const recent = await env.DB.prepare(
    "SELECT COUNT(*) AS total FROM inquiries WHERE ip_hash = ? AND created_at >= datetime('now', '-10 minutes')"
  ).bind(ipHash).first();

  if ((recent?.total || 0) >= 5) {
    return json({ success: false, error: "Too many inquiries. Please try again later." }, 429);
  }

  const userAgent = (request.headers.get("User-Agent") || "").slice(0, 500);
  const inserted = await env.DB.prepare(
    "INSERT INTO inquiries (name, email, message, page_url, ip_hash, user_agent, status, email_status) VALUES (?, ?, ?, ?, ?, ?, 'new', 'pending')"
  ).bind(name, email, message || null, pageUrl || null, ipHash, userAgent).run();

  const inquiryId = inserted.meta?.last_row_id ?? null;
  let notificationSent = false;

  if (env.RESEND_API_KEY && env.NOTIFY_EMAIL && env.FROM_EMAIL) {
    try {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + env.RESEND_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: env.FROM_EMAIL,
          to: [env.NOTIFY_EMAIL],
          reply_to: email,
          subject: "New ExCrop website inquiry from " + name,
          text: [
            "A new inquiry was submitted on excrop.com.",
            "",
            "Name: " + name,
            "Email: " + email,
            "Message:",
            message || "(No message provided)",
            "",
            "Page: " + pageUrl,
            "Inquiry ID: " + inquiryId
          ].join("\n")
        })
      });
      notificationSent = emailResponse.ok;
      if (!emailResponse.ok) {
        console.error("Resend notification failed:", emailResponse.status, await emailResponse.text());
      }
    } catch (error) {
      console.error("Email notification error:", error);
    }
    await env.DB.prepare("UPDATE inquiries SET email_status = ? WHERE id = ?")
      .bind(notificationSent ? "sent" : "failed", inquiryId).run();
  }

  return json({ success: true, inquiryId, notificationSent });
}

export async function onRequest(context) {
  if (context.request.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { "Allow": "POST", "Cache-Control": "no-store" }
    });
  }
  return onRequestPost(context);
}
