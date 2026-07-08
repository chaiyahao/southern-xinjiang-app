-- Supabase SQL Schema setup for Southern Xinjiang Luxury Travel Dashboard
-- Execute this script in your Supabase SQL Editor.

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TRIPS TABLE
CREATE TABLE IF NOT EXISTS trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_number INTEGER UNIQUE NOT NULL,
    date_str VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255) NOT NULL,
    start_location VARCHAR(100) NOT NULL,
    end_location VARCHAR(100) NOT NULL,
    distance_km NUMERIC NOT NULL,
    drive_time VARCHAR(50) NOT NULL,
    elevation_gain_m INTEGER NOT NULL,
    max_elevation_m INTEGER NOT NULL,
    description TEXT NOT NULL,
    hotel_name VARCHAR(100) NOT NULL,
    activities TEXT[] NOT NULL,
    coordinates NUMERIC[] NOT NULL, -- [lng, lat]
    route_coordinates JSONB, -- list of [lng, lat] points
    weather_temp_range VARCHAR(50) NOT NULL,
    weather_icon VARCHAR(50) NOT NULL,
    weather_forecast VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. HOTELS TABLE
CREATE TABLE IF NOT EXISTS hotels (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    rating NUMERIC(3, 2) NOT NULL,
    days_stayed VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    amenities TEXT[] NOT NULL,
    highlights TEXT[] NOT NULL,
    image_prompt TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. FLIGHTS TABLE
CREATE TABLE IF NOT EXISTS flights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flight_type VARCHAR(20) NOT NULL, -- 'Outbound' or 'Return'
    route VARCHAR(255) NOT NULL,
    total_duration VARCHAR(50) NOT NULL,
    baggage_limit VARCHAR(100) NOT NULL,
    legs JSONB NOT NULL, -- Array of flight legs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. LIVE_STATUS TABLE (TELEMETRY)
CREATE TABLE IF NOT EXISTS live_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    speed_kmh INTEGER NOT NULL,
    current_altitude_m INTEGER NOT NULL,
    eta_minutes INTEGER NOT NULL,
    heading VARCHAR(50) NOT NULL,
    weather_temp INTEGER NOT NULL,
    weather_condition VARCHAR(100) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. EXPENSES TABLE (BUDGET)
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name VARCHAR(100) NOT NULL,
    amount_thb INTEGER NOT NULL,
    percentage NUMERIC(5, 2) NOT NULL,
    color_hex VARCHAR(10) NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. ALERTS TABLE
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_text TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL, -- 'info', 'warning', 'critical'
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert Default Telemetry
INSERT INTO live_status (speed_kmh, current_altitude_m, eta_minutes, heading, weather_temp, weather_condition)
VALUES (75, 3100, 145, 'South-West', -2, 'Light Snow')
ON CONFLICT DO NOTHING;

-- Insert Default Alerts
INSERT INTO alerts (alert_text, severity, active) VALUES 
('High Wind Warning on Karakoram Highway near Karakul Lake', 'warning', true),
('Freezing temperatures overnight below -8°C (Ensure oxygen devices are active)', 'critical', true)
ON CONFLICT DO NOTHING;

-- 7. SOURCE REGISTRY TABLES
CREATE TABLE IF NOT EXISTS content_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_key VARCHAR(100) UNIQUE NOT NULL,
    source_name VARCHAR(255) NOT NULL,
    source_type VARCHAR(50) NOT NULL,
    base_url TEXT NOT NULL,
    default_language VARCHAR(10) NOT NULL DEFAULT 'zh',
    region_code VARCHAR(50),
    trust_level VARCHAR(20) NOT NULL DEFAULT 'official',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS source_fetch_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID NOT NULL REFERENCES content_sources(id) ON DELETE CASCADE,
    fetch_status VARCHAR(20) NOT NULL,
    response_status INTEGER,
    fetched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    finished_at TIMESTAMP WITH TIME ZONE,
    raw_payload_url TEXT,
    error_message TEXT,
    checksum VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. VERIFIED CONTENT PLATFORM
CREATE TABLE IF NOT EXISTS travel_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_key VARCHAR(150) UNIQUE NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    region_code VARCHAR(50),
    slug VARCHAR(160) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    verification_status VARCHAR(30) NOT NULL DEFAULT 'pending',
    freshness_hours INTEGER NOT NULL DEFAULT 72,
    source_id UUID REFERENCES content_sources(id) ON DELETE SET NULL,
    source_url TEXT,
    source_published_at TIMESTAMP WITH TIME ZONE,
    source_last_checked_at TIMESTAMP WITH TIME ZONE,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by VARCHAR(120),
    confidence_score NUMERIC(4, 3),
    expires_at TIMESTAMP WITH TIME ZONE,
    canonical_title VARCHAR(255) NOT NULL,
    summary TEXT,
    detail TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS travel_content_localizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID NOT NULL REFERENCES travel_content(id) ON DELETE CASCADE,
    locale VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    detail TEXT,
    seo_title VARCHAR(255),
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT travel_content_localizations_unique UNIQUE (content_id, locale)
);

CREATE TABLE IF NOT EXISTS travel_content_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID NOT NULL REFERENCES travel_content(id) ON DELETE CASCADE,
    media_type VARCHAR(30) NOT NULL DEFAULT 'image',
    storage_path TEXT NOT NULL,
    alt_text VARCHAR(255),
    caption TEXT,
    source_url TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS content_verification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID NOT NULL REFERENCES travel_content(id) ON DELETE CASCADE,
    verification_status VARCHAR(30) NOT NULL,
    reviewer VARCHAR(120),
    notes TEXT,
    checked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    snapshot_url TEXT,
    source_checksum VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_content_sources_source_key ON content_sources(source_key);
CREATE INDEX IF NOT EXISTS idx_source_fetch_runs_source_id ON source_fetch_runs(source_id, fetched_at DESC);
CREATE INDEX IF NOT EXISTS idx_travel_content_type_status ON travel_content(content_type, status);
CREATE INDEX IF NOT EXISTS idx_travel_content_verification ON travel_content(verification_status, expires_at);
CREATE INDEX IF NOT EXISTS idx_travel_content_source ON travel_content(source_id, source_last_checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_travel_content_localizations_locale ON travel_content_localizations(locale, content_id);
CREATE INDEX IF NOT EXISTS idx_travel_content_media_content ON travel_content_media(content_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_content_verification_logs_content ON content_verification_logs(content_id, checked_at DESC);

-- 9. REALTIME TRAVELER LOCATIONS
CREATE TABLE IF NOT EXISTS traveler_locations (
    traveler_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT traveler_locations_lat_range CHECK (lat >= -90 AND lat <= 90),
    CONSTRAINT traveler_locations_lng_range CHECK (lng >= -180 AND lng <= 180)
);

CREATE INDEX IF NOT EXISTS idx_traveler_locations_updated_at ON traveler_locations(updated_at DESC);

-- 10. REALTIME GROUP CHAT
CREATE TABLE IF NOT EXISTS travel_chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender VARCHAR(120) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_travel_chat_messages_created_at ON travel_chat_messages(created_at ASC);

-- 11. SHARED GROUP EXPENSE LEDGER SNAPSHOT
CREATE TABLE IF NOT EXISTS expense_split_snapshot (
    id VARCHAR(50) PRIMARY KEY,
    split_expenses JSONB NOT NULL DEFAULT '[]'::jsonb,
    expense_logs JSONB NOT NULL DEFAULT '[]'::jsonb,
    payment_records JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO expense_split_snapshot (id, split_expenses, expense_logs, payment_records)
VALUES ('group-ledger', '[]'::jsonb, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime'
          AND schemaname = 'public'
          AND tablename = 'traveler_locations'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE traveler_locations;
    END IF;
    IF NOT EXISTS (
        SELECT 1
        FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime'
          AND schemaname = 'public'
          AND tablename = 'travel_chat_messages'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE travel_chat_messages;
    END IF;
    IF NOT EXISTS (
        SELECT 1
        FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime'
          AND schemaname = 'public'
          AND tablename = 'expense_split_snapshot'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE expense_split_snapshot;
    END IF;
END $$;

CREATE OR REPLACE VIEW published_verified_content AS
SELECT
    tc.id,
    tc.content_key,
    tc.content_type,
    tc.region_code,
    tc.slug,
    tc.status,
    tc.verification_status,
    tc.freshness_hours,
    tc.source_id,
    tc.source_url,
    tc.source_published_at,
    tc.source_last_checked_at,
    tc.verified_at,
    tc.verified_by,
    tc.confidence_score,
    tc.expires_at,
    tc.canonical_title,
    tc.summary,
    tc.detail,
    tc.metadata,
    cs.source_name,
    cs.source_key,
    cs.base_url,
    cs.trust_level
FROM travel_content tc
LEFT JOIN content_sources cs ON cs.id = tc.source_id
WHERE tc.status = 'published'
  AND tc.verification_status IN ('verified', 'official')
  AND (tc.expires_at IS NULL OR tc.expires_at > CURRENT_TIMESTAMP);

INSERT INTO content_sources (source_key, source_name, source_type, base_url, default_language, region_code, trust_level, notes)
VALUES
('xinjiang-transport', 'Xinjiang Transport Department', 'government', 'https://jtyst.xinjiang.gov.cn/', 'zh', 'xinjiang', 'official', 'Primary official source for road and transport notices.'),
('kashgar-tourism', 'Kashgar Culture and Tourism Bureau', 'government', 'http://wglj.kashi.gov.cn/', 'zh', 'kashgar', 'official', 'Destination operations and tourism announcements.'),
('tashkurgan-tourism', 'Tashkurgan Tourism Bureau', 'government', 'http://www.xjtsg.gov.cn/', 'zh', 'tashkurgan', 'official', 'Pamir plateau and Panlong route operational notices.'),
('hotan-government', 'Hotan Prefecture Government', 'government', 'http://www.ht.gov.cn/', 'zh', 'hotan', 'official', 'Regional government updates and tourism notices.'),
('aksu-government', 'Aksu Prefecture Government', 'government', 'http://www.aks.gov.cn/', 'zh', 'aksu', 'official', 'Aksu region notices and destination operations.')
ON CONFLICT (source_key) DO NOTHING;

-- 12. DISABLE ROW LEVEL SECURITY FOR PUBLIC/ANONYMOUS SHARING TABLES
ALTER TABLE travel_chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE traveler_locations DISABLE ROW LEVEL SECURITY;
ALTER TABLE expense_split_snapshot DISABLE ROW LEVEL SECURITY;
