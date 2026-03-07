-- Link generated articles to their destinations
INSERT INTO article_destinations (article_id, destination_id, is_primary) VALUES
(2, 1, true),   -- Cartagena guide -> Cartagena
(3, 2, true),   -- Medellín barrios -> Medellín
(4, 4, true),   -- Bogotá guide -> Bogotá
(5, 3, true),   -- Santa Marta playas -> Santa Marta
(6, 11, true),  -- Cali guide -> Cali
(7, 5, true),   -- San Andrés guide -> San Andrés
(8, 12, true),  -- Barranquilla guide -> Barranquilla
(9, 13, true)   -- Bucaramanga guide -> Bucaramanga
ON CONFLICT DO NOTHING;

-- Update article counts
UPDATE destinations SET article_count = (
  SELECT COUNT(*) FROM article_destinations ad
  JOIN articles a ON a.id = ad.article_id
  WHERE ad.destination_id = destinations.id AND a.status = 'published'
);

-- RSS Sources for tourism news
INSERT INTO curated_sources (name, url, rss_feed_url, category_id, is_active) VALUES
('Hosteltur LATAM', 'https://www.hosteltur.com/latam', 'https://www.hosteltur.com/rss/latam', 5, true),
('Reportur', 'https://www.reportur.com', 'https://www.reportur.com/rss', 5, true),
('Skift', 'https://skift.com', 'https://skift.com/feed/', 3, true),
('PhocusWire', 'https://www.phocuswire.com', 'https://www.phocuswire.com/rss', 3, true),
('Travel Weekly', 'https://www.travelweekly.com', 'https://www.travelweekly.com/rss', 5, true),
('AirlineGeeks', 'https://airlinegeeks.com', 'https://airlinegeeks.com/feed/', 5, true)
ON CONFLICT DO NOTHING;
