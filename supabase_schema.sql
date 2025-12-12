-- Vialytics Supabase Schema
-- Run this in your Supabase SQL Editor

-- Table to store wallet analytics
CREATE TABLE IF NOT EXISTS wallet_analytics (
  id BIGSERIAL PRIMARY KEY,
  wallet_address TEXT NOT NULL UNIQUE,
  analytics_json JSONB NOT NULL,
  indexed_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT wallet_analytics_wallet_address_key UNIQUE (wallet_address)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_wallet_analytics_wallet 
  ON wallet_analytics(wallet_address);

CREATE INDEX IF NOT EXISTS idx_wallet_analytics_updated 
  ON wallet_analytics(updated_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_wallet_analytics_updated_at 
  BEFORE UPDATE ON wallet_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Table to track indexing jobs
CREATE TABLE IF NOT EXISTS indexing_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_indexing_jobs_wallet 
  ON indexing_jobs(wallet_address);

CREATE INDEX IF NOT EXISTS idx_indexing_jobs_status 
  ON indexing_jobs(status);
