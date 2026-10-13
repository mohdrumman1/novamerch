CREATE TABLE IF NOT EXISTS feedback_responses (
  id TEXT PRIMARY KEY,
  order_ref TEXT NOT NULL UNIQUE,
  overall_rating INTEGER NOT NULL CHECK(overall_rating BETWEEN 1 AND 5),
  communication_rating INTEGER NOT NULL CHECK(communication_rating BETWEEN 1 AND 5),
  product_quality_rating INTEGER NOT NULL CHECK(product_quality_rating BETWEEN 1 AND 5),
  resolution_rating INTEGER CHECK(resolution_rating BETWEEN 1 AND 5),
  what_went_well TEXT,
  what_we_can_improve TEXT NOT NULL,
  future_business TEXT NOT NULL CHECK(future_business IN ('Yes', 'Maybe', 'No')),
  permission_to_contact INTEGER NOT NULL DEFAULT 0,
  submitted_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_feedback_responses_submitted_at ON feedback_responses(submitted_at DESC);
