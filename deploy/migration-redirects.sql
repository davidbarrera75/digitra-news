-- Redirects table for 301 SEO recovery
-- Idempotent: safe to run multiple times.

CREATE TABLE IF NOT EXISTS redirects (
  id           SERIAL PRIMARY KEY,
  from_path    VARCHAR(500) NOT NULL UNIQUE,
  to_path      VARCHAR(500) NOT NULL,
  status_code  INTEGER NOT NULL DEFAULT 301,
  hits         INTEGER NOT NULL DEFAULT 0,
  notes        TEXT,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_hit_at  TIMESTAMP
);

CREATE INDEX IF NOT EXISTS redirects_from_path_idx ON redirects (from_path);
