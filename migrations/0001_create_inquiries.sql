-- ExCrop contact inquiries (Cloudflare D1 / SQLite)
CREATE TABLE IF NOT EXISTS inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT,
  page_url TEXT,
  ip_hash TEXT,
  user_agent TEXT,
  spam_score INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'read', 'replied', 'archived', 'spam')),
  email_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (email_status IN ('pending', 'sent', 'failed')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_inquiries_created ON inquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_ip_created ON inquiries(ip_hash, created_at);
