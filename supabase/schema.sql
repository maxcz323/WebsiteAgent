-- Run this in your Supabase SQL editor to set up the schema.

CREATE TABLE IF NOT EXISTS leads (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  business_niche TEXT NOT NULL,
  city         TEXT NOT NULL,
  website_style TEXT NOT NULL,
  business_name TEXT,
  contact_name TEXT,
  contact_email TEXT,
  status       TEXT NOT NULL DEFAULT 'new',
  notes        TEXT,
  color_scheme TEXT NOT NULL DEFAULT 'auto',
  custom_description TEXT
);

CREATE TABLE IF NOT EXISTS generated_pages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id      UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  html_content TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_drafts (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id        UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  gmail_draft_id TEXT,
  subject        TEXT NOT NULL,
  body           TEXT NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Key-value store for app settings (e.g., Gmail OAuth tokens)
CREATE TABLE IF NOT EXISTS settings (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS leads_status_idx      ON leads(status);
CREATE INDEX IF NOT EXISTS leads_created_at_idx  ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS gen_pages_lead_id_idx ON generated_pages(lead_id);
CREATE INDEX IF NOT EXISTS drafts_lead_id_idx    ON email_drafts(lead_id);

-- ── Auth & Profiles ────────────────────────────────────────────────────────────

-- User profiles (one per auth.users row)
CREATE TABLE IF NOT EXISTS profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile when a user is invited / signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Track who created each lead
ALTER TABLE leads ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Deal value in CZK
ALTER TABLE leads ADD COLUMN IF NOT EXISTS deal_value INTEGER DEFAULT NULL;

-- ── Row Level Security ─────────────────────────────────────────────────────────
-- API routes use the service role key (bypasses RLS).
-- RLS is needed for Realtime subscriptions from the browser (anon/user key).

ALTER TABLE leads           ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_drafts    ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles        ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read/write all leads
CREATE POLICY "auth_select_leads" ON leads FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_insert_leads" ON leads FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "auth_update_leads" ON leads FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_delete_leads" ON leads FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "auth_select_pages"  ON generated_pages FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_select_drafts" ON email_drafts    FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_select_profiles" ON profiles      FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_update_profiles" ON profiles      FOR UPDATE USING (auth.uid() = id);

-- ── Realtime ───────────────────────────────────────────────────────────────────
-- Enables live updates on the leads table for all connected clients.
ALTER PUBLICATION supabase_realtime ADD TABLE leads;
