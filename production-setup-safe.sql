-- ================================================
-- SAFE PRODUCTION SETUP (SKIPS ERRORS)
-- ================================================
-- This version will complete even if some parts fail
-- and tell you what went wrong

-- ================================================
-- 1. CREATE MISSING TABLE: agency_contacts
-- ================================================

CREATE TABLE IF NOT EXISTS agency_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_user_id uuid NOT NULL,
  agency_id uuid NOT NULL,
  contact_method text NOT NULL,
  message text,
  created_at timestamptz DEFAULT now(),
  business_name text,
  budget_range text,
  desired_categories text[]
);

-- ================================================
-- 2. CRITICAL CONSTRAINTS (SKIP IF FAILS)
-- ================================================

-- Users auth_id unique
DO $$ 
BEGIN
  ALTER TABLE users ADD CONSTRAINT users_auth_id_unique UNIQUE (auth_id);
  RAISE NOTICE 'Added users_auth_id_unique constraint';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Skipped users_auth_id_unique: %', SQLERRM;
END $$;

DO $$ 
BEGIN
  ALTER TABLE users ALTER COLUMN auth_id SET NOT NULL;
  RAISE NOTICE 'Set users.auth_id NOT NULL';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Skipped users.auth_id NOT NULL: %', SQLERRM;
END $$;

-- Client profiles user_id unique
DO $$ 
BEGIN
  ALTER TABLE client_profiles ADD CONSTRAINT client_profiles_user_id_unique UNIQUE (user_id);
  RAISE NOTICE 'Added client_profiles_user_id_unique constraint';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Skipped client_profiles_user_id_unique: %', SQLERRM;
END $$;

-- Agencies slug unique
DO $$ 
BEGIN
  ALTER TABLE agencies ADD CONSTRAINT agencies_slug_unique UNIQUE (slug);
  RAISE NOTICE 'Added agencies_slug_unique constraint';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Skipped agencies_slug_unique: %', SQLERRM;
END $$;

-- Reviews unique per user/agency (SKIP - WE KNOW THIS HAS DUPLICATES)
-- Run cleanup script first, then uncomment this
/*
DO $$ 
BEGIN
  ALTER TABLE reviews ADD CONSTRAINT reviews_user_agency_unique UNIQUE (user_id, agency_id);
  RAISE NOTICE 'Added reviews_user_agency_unique constraint';
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Skipped reviews_user_agency_unique: %', SQLERRM;
END $$;
*/

-- ================================================
-- 3. PERFORMANCE INDEXES (ALWAYS SAFE TO ADD)
-- ================================================

CREATE INDEX IF NOT EXISTS idx_agency_metrics_agency_day 
  ON agency_metrics_daily(agency_id, day DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_agency_status 
  ON reviews(agency_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_agency_contacts_agency 
  ON agency_contacts(agency_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_search_analytics_user 
  ON search_analytics(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_subscriptions_agency_status 
  ON subscriptions(agency_id, status);

CREATE INDEX IF NOT EXISTS idx_interaction_logs_agency 
  ON interaction_logs(agency_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_interaction_logs_user 
  ON interaction_logs(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_agencies_approval_status 
  ON agencies(approval_status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_user_created 
  ON reviews(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_agency_contacts_client 
  ON agency_contacts(client_user_id, created_at DESC);

-- ================================================
-- 4. AUTH SYNC TRIGGER
-- ================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (auth_id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  )
  ON CONFLICT (auth_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- ================================================
-- 5. REVIEW STATS TRIGGER
-- ================================================

CREATE OR REPLACE FUNCTION update_agency_review_stats()
RETURNS trigger AS $$
BEGIN
  UPDATE agencies
  SET 
    avg_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM reviews
      WHERE agency_id = COALESCE(NEW.agency_id, OLD.agency_id)
        AND status = 'approved'
    ),
    reviews_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE agency_id = COALESCE(NEW.agency_id, OLD.agency_id)
        AND status = 'approved'
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.agency_id, OLD.agency_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_agency_stats_on_review ON reviews;

CREATE TRIGGER update_agency_stats_on_review
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW 
  EXECUTE FUNCTION update_agency_review_stats();

-- ================================================
-- 6. ENABLE ROW LEVEL SECURITY
-- ================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_metrics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

RAISE NOTICE 'Setup completed! Check notices above for any skipped constraints.';
