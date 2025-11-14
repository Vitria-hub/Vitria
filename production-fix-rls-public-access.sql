-- ================================================
-- FIX RLS POLICIES FOR PUBLIC ACCESS
-- ================================================
-- Run this in your Supabase SQL Editor to fix the 500 errors

-- ================================================
-- 1. ADD MISSING PUBLIC POLICIES
-- ================================================

-- Allow anyone to view sponsored slots (for homepage carousel)
DROP POLICY IF EXISTS "Anyone can view active sponsored slots" ON sponsored_slots;
CREATE POLICY "Anyone can view active sponsored slots" 
  ON sponsored_slots FOR SELECT 
  USING (true);

-- Ensure interaction logs can be created anonymously (for analytics)
DROP POLICY IF EXISTS "Anyone can create interaction logs" ON interaction_logs;
CREATE POLICY "Anyone can create interaction logs" 
  ON interaction_logs FOR INSERT 
  WITH CHECK (true);

-- Ensure search analytics can be created anonymously
DROP POLICY IF EXISTS "Anyone can create search analytics" ON search_analytics;
CREATE POLICY "Anyone can create search analytics" 
  ON search_analytics FOR INSERT 
  WITH CHECK (true);

-- ================================================
-- 2. FIX EXISTING POLICIES (ENSURE PUBLIC ACCESS)
-- ================================================

-- Recreate agencies SELECT policy to ensure it works for anon users
DROP POLICY IF EXISTS "Anyone can view approved agencies" ON agencies;
CREATE POLICY "Anyone can view approved agencies" 
  ON agencies FOR SELECT 
  USING (
    approval_status = 'approved' 
    OR 
    (auth.uid() IS NOT NULL AND owner_id IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    ))
  );

-- Recreate reviews SELECT policy for public access
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON reviews;
CREATE POLICY "Anyone can view approved reviews" 
  ON reviews FOR SELECT 
  USING (
    status = 'approved' 
    OR 
    (auth.uid() IS NOT NULL AND user_id IN (
      SELECT id FROM users WHERE auth_id = auth.uid()
    ))
  );

-- Ensure portfolio items are publicly viewable
DROP POLICY IF EXISTS "Anyone can view portfolio items" ON portfolio_items;
CREATE POLICY "Anyone can view portfolio items" 
  ON portfolio_items FOR SELECT 
  USING (true);

-- ================================================
-- 3. VERIFY POLICIES ARE WORKING
-- ================================================

-- Check which policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Policies should now allow:
-- ✅ Anonymous users can view approved agencies
-- ✅ Anonymous users can view approved reviews  
-- ✅ Anonymous users can view portfolio items
-- ✅ Anonymous users can view sponsored slots
-- ✅ Anonymous users can create analytics logs
