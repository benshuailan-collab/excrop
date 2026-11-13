# ExCrop contact backend — deployment checklist

This branch adds a Cloudflare Pages Function at `/api/contact` and a D1 migration. It is intentionally not deployed to the production branch.

## 1. Create a Cloudflare D1 database

In Cloudflare Dashboard, open **Workers & Pages → D1 SQL Database → Create database**.
Use the name `excrop-db`. Copy the database ID.

## 2. Apply the migration

Run the SQL in `migrations/0001_create_inquiries.sql` against the new D1 database, using the D1 Console or Wrangler:

```bash
npx wrangler d1 execute excrop-db --remote --file=migrations/0001_create_inquiries.sql
```

## 3. Bind D1 to the Pages project

Open **Workers & Pages → excrop Pages project → Settings → Functions → D1 database bindings**.
Add a binding with variable name `DB` and select `excrop-db`.

## 4. Configure email notifications (Resend)

The inquiry is saved to D1 even if email is not configured. To receive notification emails, add these production environment variables under **Settings → Variables and Secrets**:

- `RESEND_API_KEY` — store as a secret, never in Git.
- `NOTIFY_EMAIL` — notification destination (for example, the sales inbox you control).
- `FROM_EMAIL` — a verified sender on a domain configured in Resend.
- `IP_HASH_SALT` — a long random secret used to hash visitor IPs before storage.

Do not use an unverified sender address. Verify the sending domain with Resend first.

## 5. Deploy safely

Review and merge this feature branch only after D1 and the email variables are configured. Cloudflare Pages deploys the production branch automatically; merging before bindings are ready will make the endpoint return a configuration error.

## 6. Test after deployment

Submit the contact form with a real test email and verify:
- The browser receives `{ "success": true }`.
- A new row appears in the D1 `inquiries` table.
- An email arrives at `NOTIFY_EMAIL`.
- A sixth submission from the same IP within ten minutes is rate-limited.

The API does not expose inquiry records publicly. An authenticated admin inbox is a separate later phase.
