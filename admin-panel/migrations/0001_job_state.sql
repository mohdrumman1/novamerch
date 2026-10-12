CREATE TABLE IF NOT EXISTS job_state (
  id TEXT PRIMARY KEY,
  job_type TEXT NOT NULL,
  status TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  payload_json TEXT NOT NULL,
  result_json TEXT,
  available_at TEXT NOT NULL,
  locked_at TEXT,
  completed_at TEXT,
  last_error TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_job_state_type_id ON job_state(job_type, id);
CREATE INDEX IF NOT EXISTS idx_job_state_due ON job_state(status, available_at);

CREATE TABLE IF NOT EXISTS event_ledger (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  aggregate_type TEXT NOT NULL,
  aggregate_id TEXT NOT NULL,
  provider_id TEXT,
  status TEXT NOT NULL,
  payload_hash TEXT NOT NULL,
  occurred_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_event_provider ON event_ledger(event_type, provider_id);

CREATE TABLE IF NOT EXISTS inbound_enquiries (
  id TEXT PRIMARY KEY,
  idempotency_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  selections_json TEXT NOT NULL,
  attribution_json TEXT,
  status TEXT NOT NULL DEFAULT 'New',
  customer_ref TEXT,
  quote_ref TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS approval_snapshots (
  id TEXT PRIMARY KEY,
  order_ref TEXT NOT NULL,
  version INTEGER NOT NULL,
  status TEXT NOT NULL,
  specifications_json TEXT NOT NULL,
  artwork_object_key TEXT,
  approved_by TEXT,
  approved_at TEXT,
  created_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_approval_version ON approval_snapshots(order_ref, version);
