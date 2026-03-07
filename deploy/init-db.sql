-- Schema creation for digitra_news
-- Run as: psql -U digitra -d digitra_news -f init-db.sql

CREATE SCHEMA IF NOT EXISTS "public";

CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500),
    "meta_title" VARCHAR(200),
    "meta_description" VARCHAR(320),
    "color" VARCHAR(7),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "articles" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "subtitle" VARCHAR(500),
    "content" TEXT NOT NULL,
    "excerpt" VARCHAR(500),
    "cover_image" VARCHAR(500),
    "cover_image_alt" VARCHAR(255),
    "category_id" INTEGER,
    "subcategory" VARCHAR(100),
    "source_type" VARCHAR(20) NOT NULL DEFAULT 'original',
    "source_url" VARCHAR(500),
    "source_name" VARCHAR(200),
    "meta_title" VARCHAR(200),
    "meta_description" VARCHAR(320),
    "canonical_url" VARCHAR(500),
    "og_image" VARCHAR(500),
    "reading_time" INTEGER NOT NULL DEFAULT 5,
    "faq_items" JSONB,
    "tags" TEXT[],
    "data_highlights" JSONB,
    "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "scheduled_at" TIMESTAMP(3),
    "seo_keyword" VARCHAR(200),
    "views_count" INTEGER NOT NULL DEFAULT 0,
    "shares_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "destinations" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "country" VARCHAR(100) NOT NULL,
    "country_slug" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500),
    "cover_image" VARCHAR(500),
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "article_count" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "destinations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "article_destinations" (
    "article_id" INTEGER NOT NULL,
    "destination_id" INTEGER NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "article_destinations_pkey" PRIMARY KEY ("article_id","destination_id")
);

CREATE TABLE "subscribers" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(200),
    "source" VARCHAR(50),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "confirmed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "subscribers_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "cta_clicks" (
    "id" SERIAL NOT NULL,
    "article_id" INTEGER,
    "cta_type" VARCHAR(50),
    "cta_text" VARCHAR(200),
    "destination_url" VARCHAR(500),
    "referrer_url" VARCHAR(500),
    "user_agent" VARCHAR(500),
    "clicked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "cta_clicks_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "curated_sources" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "rss_feed_url" VARCHAR(500),
    "category_id" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_fetched_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "curated_sources_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "page_views" (
    "id" SERIAL NOT NULL,
    "article_id" INTEGER,
    "path" VARCHAR(500),
    "referrer" VARCHAR(500),
    "ai_source" VARCHAR(50),
    "utm_source" VARCHAR(100),
    "utm_medium" VARCHAR(100),
    "utm_campaign" VARCHAR(100),
    "country" VARCHAR(5),
    "device" VARCHAR(20),
    "viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "page_views_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "market_data" (
    "id" SERIAL NOT NULL,
    "destination_id" INTEGER,
    "metric_type" VARCHAR(50) NOT NULL,
    "value" DECIMAL(12,2) NOT NULL,
    "previous_value" DECIMAL(12,2),
    "period" VARCHAR(20) NOT NULL,
    "source" VARCHAR(100),
    "raw_data" JSONB,
    "collected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "market_data_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");
CREATE INDEX "articles_status_idx" ON "articles"("status");
CREATE INDEX "articles_category_id_idx" ON "articles"("category_id");
CREATE INDEX "articles_published_at_idx" ON "articles"("published_at" DESC);
CREATE INDEX "articles_is_featured_idx" ON "articles"("is_featured");
CREATE INDEX "articles_source_type_idx" ON "articles"("source_type");
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");
CREATE UNIQUE INDEX "destinations_slug_key" ON "destinations"("slug");
CREATE UNIQUE INDEX "subscribers_email_key" ON "subscribers"("email");
CREATE INDEX "cta_clicks_article_id_idx" ON "cta_clicks"("article_id");
CREATE INDEX "page_views_article_id_idx" ON "page_views"("article_id");
CREATE INDEX "page_views_ai_source_idx" ON "page_views"("ai_source");
CREATE INDEX "market_data_destination_id_metric_type_period_idx" ON "market_data"("destination_id", "metric_type", "period");

-- Foreign Keys
ALTER TABLE "articles" ADD CONSTRAINT "articles_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "article_destinations" ADD CONSTRAINT "article_destinations_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "article_destinations" ADD CONSTRAINT "article_destinations_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "cta_clicks" ADD CONSTRAINT "cta_clicks_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "curated_sources" ADD CONSTRAINT "curated_sources_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "page_views" ADD CONSTRAINT "page_views_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "market_data" ADD CONSTRAINT "market_data_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Seed: Categories
INSERT INTO categories (name, slug, description, color, sort_order) VALUES
('Destinos', 'destinos', 'Guías, experiencias y rutas por ciudad', '#0EA5E9', 1),
('Data Turismo', 'datos', 'Precios, ocupación, rankings y reportes basados en datos', '#10B981', 2),
('Tendencias', 'tendencias', 'Búsquedas, proyecciones y análisis de la industria', '#8B5CF6', 3),
('Alquiler Vacacional', 'alquiler-vacacional', 'Tips para anfitriones, comparativas y guías de reserva', '#F59E0B', 4),
('Noticias', 'noticias', 'Curación diaria de noticias del sector turístico', '#EF4444', 5);

-- Seed: Destinations
INSERT INTO destinations (name, slug, country, country_slug) VALUES
('Cartagena', 'cartagena', 'Colombia', 'colombia'),
('Medellín', 'medellin', 'Colombia', 'colombia'),
('Santa Marta', 'santa-marta', 'Colombia', 'colombia'),
('Bogotá', 'bogota', 'Colombia', 'colombia'),
('San Andrés', 'san-andres', 'Colombia', 'colombia'),
('Guatapé', 'guatape', 'Colombia', 'colombia'),
('Cancún', 'cancun', 'México', 'mexico'),
('Tulum', 'tulum', 'México', 'mexico'),
('Lima', 'lima', 'Perú', 'peru'),
('Buenos Aires', 'buenos-aires', 'Argentina', 'argentina');

-- Seed: Curated Sources
INSERT INTO curated_sources (name, url, rss_feed_url, category_id) VALUES
('Hosteltur LATAM', 'https://www.hosteltur.com/latam', 'https://www.hosteltur.com/rss/latam', 5),
('Reportur', 'https://www.reportur.com', NULL, 5),
('Skift', 'https://skift.com', 'https://skift.com/feed/', 3),
('PhocusWire', 'https://www.phocuswire.com', 'https://www.phocuswire.com/rss', 3);
