-- ================================================
-- STEP 3: CREATE RLS POLICIES
-- ================================================
-- Run this after step 2 to add security policies

-- Users policies
CREATE POLICY "Users can view their own profile" 
  ON users FOR SELECT 
  USING (auth.uid() = auth_id);

CREATE POLICY "Users can update their own profile" 
  ON users FOR UPDATE 
  USING (auth.uid() = auth_id);

-- Agencies policies
CREATE POLICY "Anyone can view approved agencies" 
  ON agencies FOR SELECT 
  USING (approval_status = 'approved' OR owner_id IN (
    SELECT id FROM users WHERE auth_id = auth.uid()
  ));

CREATE POLICY "Agency owners can update their agency" 
  ON agencies FOR UPDATE 
  USING (owner_id IN (
    SELECT id FROM users WHERE auth_id = auth.uid()
  ));

CREATE POLICY "Agency owners can insert their agency" 
  ON agencies FOR INSERT 
  WITH CHECK (owner_id IN (
    SELECT id FROM users WHERE auth_id = auth.uid()
  ));

-- Client profiles policies
CREATE POLICY "Users can view their own client profile" 
  ON client_profiles FOR SELECT 
  USING (user_id IN (
    SELECT id FROM users WHERE auth_id = auth.uid()
  ));

CREATE POLICY "Users can manage their own client profile" 
  ON client_profiles FOR ALL 
  USING (user_id IN (
    SELECT id FROM users WHERE auth_id = auth.uid()
  ));

-- Reviews policies
CREATE POLICY "Anyone can view approved reviews" 
  ON reviews FOR SELECT 
  USING (status = 'approved' OR user_id IN (
    SELECT id FROM users WHERE auth_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own reviews" 
  ON reviews FOR INSERT 
  WITH CHECK (user_id IN (
    SELECT id FROM users WHERE auth_id = auth.uid()
  ));

-- Agency contacts policies
CREATE POLICY "Agency owners can view their contacts" 
  ON agency_contacts FOR SELECT 
  USING (agency_id IN (
    SELECT id FROM agencies WHERE owner_id IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    )
  ) OR client_user_id IN (
    SELECT id FROM users WHERE auth_id = auth.uid()
  ));

CREATE POLICY "Users can create agency contacts" 
  ON agency_contacts FOR INSERT 
  WITH CHECK (client_user_id IN (
    SELECT id FROM users WHERE auth_id = auth.uid()
  ));

-- Metrics policies
CREATE POLICY "Agency owners can view their metrics" 
  ON agency_metrics_daily FOR SELECT 
  USING (agency_id IN (
    SELECT id FROM agencies WHERE owner_id IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    )
  ));

-- Portfolio policies
CREATE POLICY "Anyone can view portfolio items" 
  ON portfolio_items FOR SELECT 
  USING (true);

CREATE POLICY "Agency owners can manage portfolio items" 
  ON portfolio_items FOR ALL 
  USING (agency_id IN (
    SELECT id FROM agencies WHERE owner_id IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    )
  ));

-- Subscriptions policies
CREATE POLICY "Agency owners can view their subscriptions" 
  ON subscriptions FOR SELECT 
  USING (agency_id IN (
    SELECT id FROM agencies WHERE owner_id IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    )
  ));

-- RLS policies complete!
