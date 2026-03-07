-- Curated Items table for auto-fetched RSS content
CREATE TABLE IF NOT EXISTS curated_items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  source_url VARCHAR(500) NOT NULL,
  source_name VARCHAR(200) NOT NULL,
  source_id INTEGER REFERENCES curated_sources(id),
  original_excerpt TEXT,
  ai_summary TEXT,
  tags TEXT[] DEFAULT '{}',
  relevance_score INTEGER DEFAULT 5,
  suggested_category VARCHAR(50),
  category_id INTEGER REFERENCES categories(id),
  status VARCHAR(20) DEFAULT 'pending',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_curated_items_status ON curated_items(status);
CREATE INDEX IF NOT EXISTS idx_curated_items_relevance ON curated_items(relevance_score DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_curated_items_url ON curated_items(source_url);
