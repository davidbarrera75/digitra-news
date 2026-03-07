-- Migration: Digitra Pulse
-- Create pulse_snapshots table

CREATE TABLE IF NOT EXISTS pulse_snapshots (
    id                SERIAL PRIMARY KEY,
    destination_id    INTEGER NOT NULL REFERENCES destinations(id),
    date              DATE NOT NULL,
    score             INTEGER DEFAULT 0,
    score_label       VARCHAR(50),
    flights_data      JSONB,
    accommodation_data JSONB,
    weather_data      JSONB,
    events_data       JSONB,
    season_type       VARCHAR(20),
    ai_summary        TEXT,
    created_at        TIMESTAMPTZ DEFAULT NOW(),
    updated_at        TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(destination_id, date)
);

CREATE INDEX idx_pulse_date ON pulse_snapshots(date DESC);
CREATE INDEX idx_pulse_dest_date ON pulse_snapshots(destination_id, date DESC);

-- Add missing destinations for Pulse
INSERT INTO destinations (name, slug, country, country_slug, latitude, longitude) VALUES
('Cali', 'cali', 'Colombia', 'colombia', 3.4516, -76.5320),
('Barranquilla', 'barranquilla', 'Colombia', 'colombia', 10.9685, -74.7813),
('Bucaramanga', 'bucaramanga', 'Colombia', 'colombia', 7.1254, -73.1198)
ON CONFLICT (slug) DO NOTHING;

-- Update coordinates for existing destinations
UPDATE destinations SET latitude = 10.3910, longitude = -75.5146 WHERE slug = 'cartagena' AND latitude IS NULL;
UPDATE destinations SET latitude = 6.2442, longitude = -75.5812 WHERE slug = 'medellin' AND latitude IS NULL;
UPDATE destinations SET latitude = 11.2408, longitude = -74.1990 WHERE slug = 'santa-marta' AND latitude IS NULL;
UPDATE destinations SET latitude = 4.7110, longitude = -74.0721 WHERE slug = 'bogota' AND latitude IS NULL;
UPDATE destinations SET latitude = 12.5847, longitude = -81.7006 WHERE slug = 'san-andres' AND latitude IS NULL;
UPDATE destinations SET latitude = 6.2306, longitude = -75.1927 WHERE slug = 'guatape' AND latitude IS NULL;
UPDATE destinations SET latitude = 21.1619, longitude = -86.8515 WHERE slug = 'cancun' AND latitude IS NULL;
UPDATE destinations SET latitude = 20.2114, longitude = -87.4654 WHERE slug = 'tulum' AND latitude IS NULL;
UPDATE destinations SET latitude = -12.0464, longitude = -77.0428 WHERE slug = 'lima' AND latitude IS NULL;
UPDATE destinations SET latitude = -34.6037, longitude = -58.3816 WHERE slug = 'buenos-aires' AND latitude IS NULL;
