-- ================================================
-- PRODUCTION DATABASE SETUP SCRIPT
-- ================================================
-- Run this in your Supabase SQL Editor
-- This script is safe to run multiple times (uses IF NOT EXISTS)

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
-- 2. ADD CRITICAL CONSTRAINTS (HIGH PRIORITY)
-- ================================================

-- Users table: auth_id must be unique and not null
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'users_auth_id_unique'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_auth_id_unique UNIQUE (auth_id);
  END IF;
END $$;

ALTER TABLE users ALTER COLUMN auth_id SET NOT NULL;

-- Client profiles: one profile per user
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'client_profiles_user_id_unique'
  ) THEN
    ALTER TABLE client_profiles ADD CONSTRAINT client_profiles_user_id_unique UNIQUE (user_id);
  END IF;
END $$;

-- Agencies: unique slugs
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'agencies_slug_unique'
  ) THEN
    ALTER TABLE agencies ADD CONSTRAINT agencies_slug_unique UNIQUE (slug);
  END IF;
END $$;

-- Reviews: prevent duplicate reviews from same user
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'reviews_user_agency_unique'
  ) THEN
    ALTER TABLE reviews ADD CONSTRAINT reviews_user_agency_unique UNIQUE (user_id, agency_id);
  END IF;
END $$;

-- ================================================
-- 3. ADD FOREIGN KEY CONSTRAINTS WITH CASCADE
-- ================================================

-- Agency contacts foreign keys
ALTER TABLE agency_contacts 
  DROP CONSTRAINT IF EXISTS agency_contacts_agency_id_fkey;

ALTER TABLE agency_contacts 
  ADD CONSTRAINT agency_contacts_agency_id_fkey 
  FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE CASCADE;

ALTER TABLE agency_contacts 
  DROP CONSTRAINT IF EXISTS agency_contacts_client_user_id_fkey;

ALTER TABLE agency_contacts 
  ADD CONSTRAINT agency_contacts_client_user_id_fkey 
  FOREIGN KEY (client_user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Agency metrics daily
ALTER TABLE agency_metrics_daily 
  DROP CONSTRAINT IF EXISTS agency_metrics_daily_agency_id_fkey;

ALTER TABLE agency_metrics_daily 
  ADD CONSTRAINT agency_metrics_daily_agency_id_fkey 
  FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE CASCADE;

-- Portfolio items
ALTER TABLE portfolio_items 
  DROP CONSTRAINT IF EXISTS portfolio_items_agency_id_fkey;

ALTER TABLE portfolio_items 
  ADD CONSTRAINT portfolio_items_agency_id_fkey 
  FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE CASCADE;

-- Sponsored slots
ALTER TABLE sponsored_slots 
  DROP CONSTRAINT IF EXISTS sponsored_slots_agency_id_fkey;

ALTER TABLE sponsored_slots 
  ADD CONSTRAINT sponsored_slots_agency_id_fkey 
  FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE CASCADE;

-- Subscriptions
ALTER TABLE subscriptions 
  DROP CONSTRAINT IF EXISTS subscriptions_agency_id_fkey;

ALTER TABLE subscriptions 
  ADD CONSTRAINT subscriptions_agency_id_fkey 
  FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE CASCADE;

-- Interaction logs (SET NULL to preserve analytics)
ALTER TABLE interaction_logs 
  DROP CONSTRAINT IF EXISTS interaction_logs_agency_id_fkey;

ALTER TABLE interaction_logs 
  ADD CONSTRAINT interaction_logs_agency_id_fkey 
  FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE SET NULL;

ALTER TABLE interaction_logs 
  DROP CONSTRAINT IF EXISTS interaction_logs_user_id_fkey;

ALTER TABLE interaction_logs 
  ADD CONSTRAINT interaction_logs_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

-- Search analytics (SET NULL to preserve analytics)
ALTER TABLE search_analytics 
  DROP CONSTRAINT IF EXISTS search_analytics_clicked_agency_id_fkey;

ALTER TABLE search_analytics 
  ADD CONSTRAINT search_analytics_clicked_agency_id_fkey 
  FOREIGN KEY (clicked_agency_id) REFERENCES agencies(id) ON DELETE SET NULL;

ALTER TABLE search_analytics 
  DROP CONSTRAINT IF EXISTS search_analytics_user_id_fkey;

ALTER TABLE search_analytics 
  ADD CONSTRAINT search_analytics_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

-- Reviews
ALTER TABLE reviews 
  DROP CONSTRAINT IF EXISTS reviews_agency_id_fkey;

ALTER TABLE reviews 
  ADD CONSTRAINT reviews_agency_id_fkey 
  FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE CASCADE;

ALTER TABLE reviews 
  DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;

ALTER TABLE reviews 
  ADD CONSTRAINT reviews_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

-- Agencies owner relationship
ALTER TABLE agencies 
  DROP CONSTRAINT IF EXISTS agencies_owner_id_fkey;

ALTER TABLE agencies 
  ADD CONSTRAINT agencies_owner_id_fkey 
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE;

-- ================================================
-- 4. ADD PERFORMANCE INDEXES
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
-- 5. CREATE TRIGGER FOR REVIEW STATS AUTO-UPDATE
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
-- 6. CREATE AUTH SYNC TRIGGER (CRITICAL)
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
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- ================================================
-- 7. CREATE MATERIALIZED VIEW FOR ANALYTICS
-- ================================================

DROP MATERIALIZED VIEW IF EXISTS agency_analytics_summary;

CREATE MATERIALIZED VIEW agency_analytics_summary AS
SELECT 
  a.id,
  a.name,
  a.slug,
  a.avg_rating,
  a.reviews_count,
  a.is_premium,
  a.is_verified,
  COALESCE(SUM(m.views), 0) as total_views,
  COALESCE(SUM(m.profile_clicks), 0) as total_profile_clicks,
  COALESCE(SUM(m.contact_clicks), 0) as total_contact_clicks,
  COALESCE(SUM(m.leads), 0) as total_leads,
  COUNT(DISTINCT ac.id) as contact_count,
  a.created_at
FROM agencies a
LEFT JOIN agency_metrics_daily m ON a.id = m.agency_id
LEFT JOIN agency_contacts ac ON a.id = ac.agency_id
GROUP BY a.id, a.name, a.slug, a.avg_rating, a.reviews_count, 
         a.is_premium, a.is_verified, a.created_at;

CREATE UNIQUE INDEX IF NOT EXISTS idx_agency_analytics_summary_id 
  ON agency_analytics_summary(id);

CREATE INDEX IF NOT EXISTS idx_agency_analytics_summary_views 
  ON agency_analytics_summary(total_views DESC);

-- ================================================
-- 8. ENABLE ROW LEVEL SECURITY
-- ================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_metrics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- ================================================
-- 9. CREATE RLS POLICIES
-- ================================================

-- Users table policies
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile" 
  ON users FOR SELECT 
  USING (auth.uid() = auth_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile" 
  ON users FOR UPDATE 
  USING (auth.uid() = auth_id);

-- Agencies table policies
DROP POLICY IF EXISTS "Anyone can view approved agencies" ON agencies;
CREATE POLICY "Anyone can view approved agencies" 
  ON agencies FOR SELECT 
  USING (approval_status = 'approved' OR owner_id IN (
    SELECT id FROM users WHERE auth_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Agency owners can update their agency" ON agencies;
CREATE POLICY "Agency owners can update their agency" 
  ON agencies FOR UPDATE 
  USING (owner_id IN (
    SELECT id FROM users WHERE auth_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Agency owners can insert their agency" ON agencies;
CREATE POLICY "Agency owners can insert their agency" 
  ON agencies FOR INSERT 
  WITH CHECK (owner_id IN (
    SELECT id FROM users WHERE auth_id = auth.uid()
  ));

-- Client profiles policies
DROP POLICY IF EXISTS "Users can view their own client profile" ON client_profiles;
CREATE POLICY "Users can view their own client profile" 
  ON client_profiles FOR SELECT 
  USING (user_id IN (
    SELECT id FROM users WHERE auth_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can manage their own client profile" ON client_profiles;
CREATE POLICY "Users can manage their own client profile" 
  ON client_profiles FOR ALL 
  USING (user_id IN (
    SELECT id FROM users WHERE auth_id = auth.uid()
  ));

-- Reviews policies
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON reviews;
CREATE POLICY "Anyone can view approved reviews" 
  ON reviews FOR SELECT 
  USING (status = 'approved' OR user_id IN (
    SELECT id FROM users WHERE auth_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can insert their own reviews" ON reviews;
CREATE POLICY "Users can insert their own reviews" 
  ON reviews FOR INSERT 
  WITH CHECK (user_id IN (
    SELECT id FROM users WHERE auth_id = auth.uid()
  ));

-- Agency contacts policies
DROP POLICY IF EXISTS "Agency owners can view their contacts" ON agency_contacts;
CREATE POLICY "Agency owners can view their contacts" 
  ON agency_contacts FOR SELECT 
  USING (agency_id IN (
    SELECT id FROM agencies WHERE owner_id IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    )
  ) OR client_user_id IN (
    SELECT id FROM users WHERE auth_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can create agency contacts" ON agency_contacts;
CREATE POLICY "Users can create agency contacts" 
  ON agency_contacts FOR INSERT 
  WITH CHECK (client_user_id IN (
    SELECT id FROM users WHERE auth_id = auth.uid()
  ));

-- Metrics policies
DROP POLICY IF EXISTS "Agency owners can view their metrics" ON agency_metrics_daily;
CREATE POLICY "Agency owners can view their metrics" 
  ON agency_metrics_daily FOR SELECT 
  USING (agency_id IN (
    SELECT id FROM agencies WHERE owner_id IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    )
  ));

-- Portfolio policies
DROP POLICY IF EXISTS "Anyone can view portfolio items" ON portfolio_items;
CREATE POLICY "Anyone can view portfolio items" 
  ON portfolio_items FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Agency owners can manage portfolio items" ON portfolio_items;
CREATE POLICY "Agency owners can manage portfolio items" 
  ON portfolio_items FOR ALL 
  USING (agency_id IN (
    SELECT id FROM agencies WHERE owner_id IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    )
  ));

-- Subscriptions policies
DROP POLICY IF EXISTS "Agency owners can view their subscriptions" ON subscriptions;
CREATE POLICY "Agency owners can view their subscriptions" 
  ON subscriptions FOR SELECT 
  USING (agency_id IN (
    SELECT id FROM agencies WHERE owner_id IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    )
  ));

-- ================================================
-- SETUP COMPLETE!
-- ================================================

-- To refresh analytics (run daily):
-- REFRESH MATERIALIZED VIEW agency_analytics_summary;
