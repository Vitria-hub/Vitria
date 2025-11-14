-- ================================================
-- FIX: Update budget_range constraint in client_profiles
-- ================================================
-- This fixes the mismatch between database constraint and application code
-- Database expects: 'low', 'medium', 'high'
-- Application sends: '$', '$$', '$$$'
--
-- Solution: Update the constraint to match the application code
-- ================================================

BEGIN;

-- Drop the old constraint
ALTER TABLE client_profiles 
DROP CONSTRAINT IF EXISTS client_profiles_budget_range_check;

-- Add the new constraint with the correct values
ALTER TABLE client_profiles 
ADD CONSTRAINT client_profiles_budget_range_check 
CHECK (budget_range IN ('$', '$$', '$$$'));

-- Update any existing data to use the new format (if any exists)
UPDATE client_profiles 
SET budget_range = CASE 
  WHEN budget_range = 'low' THEN '$'
  WHEN budget_range = 'medium' THEN '$$'
  WHEN budget_range = 'high' THEN '$$$'
  ELSE budget_range
END;

COMMIT;

-- Verification query (run this after to confirm)
-- SELECT budget_range, COUNT(*) FROM client_profiles GROUP BY budget_range;
