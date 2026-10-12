CREATE TABLE IF NOT EXISTS artwork_versions (
  id TEXT PRIMARY KEY,
  order_ref TEXT NOT NULL,
  version INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending Customer Approval',
  specifications_json TEXT NOT NULL,
  artwork_key TEXT,
  requested_changes TEXT,
  approved_by TEXT,
  approved_at TEXT,
  created_at TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_artwork_version ON artwork_versions(order_ref, version);

CREATE TABLE IF NOT EXISTS fulfilment_events (
  id TEXT PRIMARY KEY,
  order_ref TEXT NOT NULL,
  supplier_ref TEXT,
  shipment_ref TEXT,
  status TEXT NOT NULL,
  quantity_json TEXT,
  occurred_at TEXT NOT NULL,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS issues_returns_refunds (
  id TEXT PRIMARY KEY,
  order_ref TEXT NOT NULL,
  kind TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Open',
  amount_aud REAL,
  details TEXT NOT NULL,
  resolved_at TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS feedback_jobs (
  id TEXT PRIMARY KEY,
  order_ref TEXT NOT NULL,
  due_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  suppressed_reason TEXT,
  sent_at TEXT
);

CREATE TABLE IF NOT EXISTS staff_audit_log (
  id TEXT PRIMARY KEY,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  details_json TEXT,
  created_at TEXT NOT NULL
);
