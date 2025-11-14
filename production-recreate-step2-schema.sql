-- ================================================
-- STEP 2: CREATE COMPLETE DATABASE SCHEMA
-- ================================================
-- Run this after step 1 to create all tables

-- ================================================
-- TABLE: users
-- ================================================
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id uuid NOT NULL UNIQUE,
  full_name text,
  avatar_url text,
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT users_role_check CHECK (role IN ('user', 'agency', 'admin'))
);

-- ================================================
-- TABLE: plans
-- ================================================
CREATE TABLE plans (
  id text PRIMARY KEY,
  name text NOT NULL,
  price_month_cents integer NOT NULL,
  benefits text[] NOT NULL
);

-- ================================================
-- TABLE: agencies
-- ================================================
CREATE TABLE agencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  logo_url text,
  cover_url text,
  description text,
  website text,
  email text,
  phone text,
  location_city text,
  location_region text,
  employees_min integer,
  employees_max integer,
  price_range text,
  services text[] NOT NULL DEFAULT '{}',
  categories text[] NOT NULL DEFAULT '{}',
  specialties text[] DEFAULT '{}',
  is_verified boolean DEFAULT false,
  is_premium boolean DEFAULT false,
  premium_until timestamptz,
  avg_rating numeric DEFAULT 0,
  reviews_count integer DEFAULT 0,
  approval_status text NOT NULL DEFAULT 'pending',
  rejection_reason text,
  approved_at timestamptz,
  reviewed_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT agencies_approval_status_check CHECK (approval_status IN ('pending', 'approved', 'rejected'))
);

-- ================================================
-- TABLE: client_profiles
-- ================================================
CREATE TABLE client_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  business_name text,
  business_instagram text,
  budget_range text,
  desired_categories text[],
  about_business text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT client_profiles_budget_range_check CHECK (budget_range IN ('low', 'medium', 'high'))
);

-- ================================================
-- TABLE: reviews
-- ================================================
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id uuid REFERENCES agencies(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  rating integer NOT NULL,
  comment text,
  status text NOT NULL DEFAULT 'pending',
  reported boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT reviews_rating_check CHECK (rating >= 1 AND rating <= 5),
  CONSTRAINT reviews_status_check CHECK (status IN ('pending', 'approved', 'rejected')),
  CONSTRAINT reviews_user_agency_unique UNIQUE (user_id, agency_id)
);

-- ================================================
-- TABLE: portfolio_items
-- ================================================
CREATE TABLE portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id uuid REFERENCES agencies(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  media_urls text[],
  client_name text,
  tags text[],
  published_at timestamptz DEFAULT now()
);

-- ================================================
-- TABLE: agency_metrics_daily
-- ================================================
CREATE TABLE agency_metrics_daily (
  day date NOT NULL,
  agency_id uuid NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  views integer DEFAULT 0,
  unique_visitors integer DEFAULT 0,
  profile_clicks integer DEFAULT 0,
  contact_clicks integer DEFAULT 0,
  phone_clicks integer DEFAULT 0,
  email_clicks integer DEFAULT 0,
  website_clicks integer DEFAULT 0,
  form_submissions integer DEFAULT 0,
  search_appearances integer DEFAULT 0,
  avg_position numeric DEFAULT 0,
  leads integer DEFAULT 0,
  PRIMARY KEY (day, agency_id)
);

-- ================================================
-- TABLE: agency_contacts
-- ================================================
CREATE TABLE agency_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  agency_id uuid NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  contact_method text NOT NULL,
  message text,
  business_name text,
  budget_range text,
  desired_categories text[],
  created_at timestamptz DEFAULT now()
);

-- ================================================
-- TABLE: interaction_logs
-- ================================================
CREATE TABLE interaction_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id uuid REFERENCES agencies(id) ON DELETE SET NULL,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  interaction_type text NOT NULL,
  session_id text,
  user_agent text,
  ip_address inet,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- ================================================
-- TABLE: search_analytics
-- ================================================
CREATE TABLE search_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  search_query text,
  service_category text,
  location_filter text,
  results_count integer NOT NULL,
  agencies_shown text[],
  clicked_agency_id uuid REFERENCES agencies(id) ON DELETE SET NULL,
  clicked_position integer,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  session_id text,
  created_at timestamptz DEFAULT now()
);

-- ================================================
-- TABLE: sponsored_slots
-- ================================================
CREATE TABLE sponsored_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id uuid REFERENCES agencies(id) ON DELETE CASCADE,
  position integer NOT NULL,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL
);

-- ================================================
-- TABLE: subscriptions
-- ================================================
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id uuid REFERENCES agencies(id) ON DELETE CASCADE,
  plan_id text REFERENCES plans(id),
  stripe_customer_id text,
  stripe_subscription_id text,
  status text NOT NULL,
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now()
);

-- ================================================
-- PERFORMANCE INDEXES
-- ================================================

-- Agencies indexes
CREATE INDEX idx_agencies_approval_status ON agencies(approval_status, created_at DESC);
CREATE INDEX agencies_gin_categories ON agencies USING gin(categories);
CREATE INDEX agencies_gin_services ON agencies USING gin(services);
CREATE INDEX agencies_loc ON agencies(location_region, location_city);
CREATE INDEX agencies_trgm_name ON agencies USING gin(name gin_trgm_ops);

-- Reviews indexes
CREATE INDEX idx_reviews_agency_status ON reviews(agency_id, status, created_at DESC);
CREATE INDEX idx_reviews_user_created ON reviews(user_id, created_at DESC);
CREATE INDEX reviews_agency_status ON reviews(agency_id, status);

-- Agency metrics indexes
CREATE INDEX idx_agency_metrics_agency_day ON agency_metrics_daily(agency_id, day DESC);

-- Agency contacts indexes
CREATE INDEX idx_agency_contacts_agency ON agency_contacts(agency_id, created_at DESC);
CREATE INDEX idx_agency_contacts_client ON agency_contacts(client_user_id, created_at DESC);

-- Interaction logs indexes
CREATE INDEX idx_interaction_logs_agency ON interaction_logs(agency_id, created_at DESC);
CREATE INDEX idx_interaction_logs_user ON interaction_logs(user_id, created_at DESC);
CREATE INDEX interaction_logs_type_created ON interaction_logs(interaction_type, created_at DESC);

-- Search analytics indexes
CREATE INDEX idx_search_analytics_user ON search_analytics(user_id, created_at DESC);
CREATE INDEX search_analytics_created ON search_analytics(created_at DESC);
CREATE INDEX search_analytics_clicked ON search_analytics(clicked_agency_id, created_at DESC) WHERE clicked_agency_id IS NOT NULL;

-- Subscriptions indexes
CREATE INDEX idx_subscriptions_agency_status ON subscriptions(agency_id, status);

-- ================================================
-- TRIGGERS
-- ================================================

-- Trigger: Auto-update agency review stats
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

CREATE TRIGGER update_agency_stats_on_review
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW 
  EXECUTE FUNCTION update_agency_review_stats();

-- Trigger: Auto-create public.users from auth.users
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
-- MATERIALIZED VIEW FOR ANALYTICS
-- ================================================

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

CREATE UNIQUE INDEX idx_agency_analytics_summary_id ON agency_analytics_summary(id);
CREATE INDEX idx_agency_analytics_summary_views ON agency_analytics_summary(total_views DESC);

-- ================================================
-- ENABLE ROW LEVEL SECURITY
-- ================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_metrics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Schema creation complete!
