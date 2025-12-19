-- Supabase Schema for Vialytics (OPTIONAL - only needed for job tracking)
-- Run this in Supabase SQL Editor if you want job status tracking

-- Table for tracking indexing jobs
CREATE TABLE IF NOT EXISTS indexing_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, running, completed, failed
    progress INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for caching analytics results
CREATE TABLE IF NOT EXISTS wallet_analytics (
    wallet_address TEXT PRIMARY KEY,
    analytics_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_jobs_wallet ON indexing_jobs(wallet_address);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON indexing_jobs(status);

-- Enable Row Level Security (RLS)
ALTER TABLE indexing_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_analytics ENABLE ROW LEVEL SECURITY;

-- Public read access (adjust based on your security needs)
CREATE POLICY "Allow public read access" ON indexing_jobs
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON wallet_analytics
    FOR SELECT USING (true);

-- Service role can do everything (for your backend)
CREATE POLICY "Service role can do everything" ON indexing_jobs
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything" ON wallet_analytics
    FOR ALL USING (auth.role() = 'service_role');
