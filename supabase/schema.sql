-- AI SOC Sentinel: Master Class Database Schema
-- Execute this script in your Supabase SQL Editor to initialize the telemetry uplink.

-- 1. Signals Table: Primary store for real-time mission telemetry
CREATE TABLE IF NOT EXISTS sentinel_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  ts BIGINT NOT NULL, -- Unix timestamp for front-end synchronization
  sector TEXT NOT NULL, -- CYBER | FINANCE | GEOINT
  severity TEXT CHECK (severity IN ('critical', 'high', 'medium', 'low', 'normal')),
  is_anomaly BOOLEAN DEFAULT false,
  threat_type TEXT,
  log_content TEXT NOT NULL,
  attacker_ip TEXT,
  mitre_attack TEXT,
  geo_lat FLOAT8,
  geo_lon FLOAT8,
  explanation TEXT,
  iocs TEXT[] DEFAULT '{}'
);

-- 2. Signatures Table: Store for AI-extracted threat patterns (OSINT)
CREATE TABLE IF NOT EXISTS sentinel_signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  category TEXT NOT NULL,
  severity TEXT,
  mitre TEXT,
  pattern TEXT,
  is_active BOOLEAN DEFAULT true
);

-- 3. Enable Realtime Visualization
-- This allows the dashboard to react instantly to database inserts.
ALTER PUBLICATION supabase_realtime ADD TABLE sentinel_signals;

-- 4. Row Level Security (RLS) - Basic Public Access for Prototype
-- Note: For production, replace these with authenticated policies.
ALTER TABLE sentinel_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE sentinel_signatures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select" ON sentinel_signals FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON sentinel_signals FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select signatures" ON sentinel_signatures FOR SELECT USING (true);
CREATE POLICY "Allow public insert signatures" ON sentinel_signatures FOR INSERT WITH CHECK (true);

-- 5. Indexes for High-Performance HUD Updates
CREATE INDEX IF NOT EXISTS idx_signals_sector ON sentinel_signals(sector);
CREATE INDEX IF NOT EXISTS idx_signals_ts ON sentinel_signals(ts DESC);
