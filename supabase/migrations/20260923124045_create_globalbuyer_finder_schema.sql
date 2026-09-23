/*
# GlobalBuyer Finder — Core Schema

## Overview
Creates the persistence layer for GlobalBuyer Finder, a B2B SaaS app that helps home décor sellers discover US business buyers via Google Places API. This is a single-tenant app (no sign-in), so all tables are shared and policies allow anon + authenticated access.

## New Tables

1. **saved_buyers** — Businesses saved by the user from search results.
   - id (uuid, PK)
   - place_id (text) — Google Places Place ID, for deduplication
   - name (text) — Business name
   - category (text) — Primary business category
   - address (text) — Full formatted address
   - city (text)
   - state (text)
   - country (text, default 'United States')
   - phone (text)
   - email (text)
   - website (text)
   - source (text) — API source, e.g. 'Google Places API'
   - raw_data (jsonb) — Full API response for reference
   - created_at (timestamptz)

2. **email_history** — Record of every email sent or attempted.
   - id (uuid, PK)
   - buyer_name (text)
   - recipient (text)
   - subject (text)
   - message (text)
   - status (text) — 'sent' | 'failed' | 'pending'
   - error_detail (text) — failure reason if any
   - created_at (timestamptz)

3. **recent_searches** — Recent search queries for dashboard display.
   - id (uuid, PK)
   - query (text) — Full search query string
   - country (text)
   - state (text)
   - city (text)
   - category (text)
   - keyword (text)
   - results_count (integer)
   - created_at (timestamptz)

## Security
- RLS enabled on all three tables.
- All policies use TO anon, authenticated (single-tenant, no sign-in) with USING (true) / WITH CHECK (true) because data is intentionally shared.
*/;

CREATE TABLE IF NOT EXISTS saved_buyers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id text,
  name text NOT NULL,
  category text,
  address text,
  city text,
  state text,
  country text DEFAULT 'United States',
  phone text,
  email text,
  website text,
  source text DEFAULT 'Google Places API',
  raw_data jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE saved_buyers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_saved_buyers" ON saved_buyers;
CREATE POLICY "anon_select_saved_buyers" ON saved_buyers FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_saved_buyers" ON saved_buyers;
CREATE POLICY "anon_insert_saved_buyers" ON saved_buyers FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_saved_buyers" ON saved_buyers;
CREATE POLICY "anon_update_saved_buyers" ON saved_buyers FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_saved_buyers" ON saved_buyers;
CREATE POLICY "anon_delete_saved_buyers" ON saved_buyers FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS email_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_name text,
  recipient text,
  subject text,
  message text,
  status text NOT NULL DEFAULT 'pending',
  error_detail text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE email_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_email_history" ON email_history;
CREATE POLICY "anon_select_email_history" ON email_history FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_email_history" ON email_history;
CREATE POLICY "anon_insert_email_history" ON email_history FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_email_history" ON email_history;
CREATE POLICY "anon_update_email_history" ON email_history FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_email_history" ON email_history;
CREATE POLICY "anon_delete_email_history" ON email_history FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS recent_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query text NOT NULL,
  country text,
  state text,
  city text,
  category text,
  keyword text,
  results_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE recent_searches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_recent_searches" ON recent_searches;
CREATE POLICY "anon_select_recent_searches" ON recent_searches FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_recent_searches" ON recent_searches;
CREATE POLICY "anon_insert_recent_searches" ON recent_searches FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_recent_searches" ON recent_searches;
CREATE POLICY "anon_update_recent_searches" ON recent_searches FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_recent_searches" ON recent_searches;
CREATE POLICY "anon_delete_recent_searches" ON recent_searches FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_saved_buyers_place_id ON saved_buyers(place_id);
CREATE INDEX IF NOT EXISTS idx_email_history_created_at ON email_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recent_searches_created_at ON recent_searches(created_at DESC);