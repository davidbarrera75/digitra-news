-- Migration: Add slug column to curated_items and populate from title
-- Run on VPS: psql -h 127.0.0.1 -U digitra -d digitra_news -f deploy/migration-curated-slugs.sql

-- Add slug column
ALTER TABLE curated_items ADD COLUMN IF NOT EXISTS slug VARCHAR(300);

-- Populate slugs from title + id for uniqueness
UPDATE curated_items
SET slug = CONCAT(
  LEFT(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        LOWER(
          TRANSLATE(title, 'áéíóúüñÁÉÍÓÚÜÑ', 'aeiouunAEIOUUN')
        ),
        '[^a-z0-9]+', '-', 'g'
      ),
      '^-|-$', '', 'g'
    ),
    250
  ),
  '-', id::text
)
WHERE slug IS NULL;

-- Add unique index
CREATE UNIQUE INDEX IF NOT EXISTS curated_items_slug_key ON curated_items(slug);
