-- Migration: Add English translation columns for i18n
-- Run on VPS: psql -h 127.0.0.1 -U digitra -d digitra_news -f migration-i18n-en.sql

-- Articles: EN translations
ALTER TABLE articles ADD COLUMN IF NOT EXISTS title_en VARCHAR(500);
ALTER TABLE articles ADD COLUMN IF NOT EXISTS subtitle_en VARCHAR(500);
ALTER TABLE articles ADD COLUMN IF NOT EXISTS content_en TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS excerpt_en VARCHAR(500);
ALTER TABLE articles ADD COLUMN IF NOT EXISTS meta_title_en VARCHAR(200);
ALTER TABLE articles ADD COLUMN IF NOT EXISTS meta_description_en VARCHAR(320);
ALTER TABLE articles ADD COLUMN IF NOT EXISTS cover_image_alt_en VARCHAR(255);
ALTER TABLE articles ADD COLUMN IF NOT EXISTS faq_items_en JSONB;

-- Categories: EN translations
ALTER TABLE categories ADD COLUMN IF NOT EXISTS name_en VARCHAR(100);
ALTER TABLE categories ADD COLUMN IF NOT EXISTS description_en VARCHAR(500);
ALTER TABLE categories ADD COLUMN IF NOT EXISTS meta_title_en VARCHAR(200);
ALTER TABLE categories ADD COLUMN IF NOT EXISTS meta_description_en VARCHAR(320);

-- Destinations: EN translations
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS description_en VARCHAR(500);

-- Curated Items: EN translations
ALTER TABLE curated_items ADD COLUMN IF NOT EXISTS title_en VARCHAR(500);
ALTER TABLE curated_items ADD COLUMN IF NOT EXISTS ai_summary_en TEXT;

-- Pulse Snapshots: EN translations
ALTER TABLE pulse_snapshots ADD COLUMN IF NOT EXISTS score_label_en VARCHAR(50);
ALTER TABLE pulse_snapshots ADD COLUMN IF NOT EXISTS ai_summary_en TEXT;

-- Seed Category translations
UPDATE categories SET name_en = 'Destinations', description_en = 'Guides, experiences and routes by city' WHERE slug = 'destinos';
UPDATE categories SET name_en = 'Tourism Data', description_en = 'Prices, occupancy, rankings and data-driven reports' WHERE slug = 'datos';
UPDATE categories SET name_en = 'Trends', description_en = 'Search trends, projections and industry analysis' WHERE slug = 'tendencias';
UPDATE categories SET name_en = 'Vacation Rental', description_en = 'Tips for hosts, comparisons and booking guides' WHERE slug = 'alquiler-vacacional';
UPDATE categories SET name_en = 'News', description_en = 'Daily curated tourism sector news' WHERE slug = 'noticias';
