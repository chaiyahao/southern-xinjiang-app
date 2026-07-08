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
