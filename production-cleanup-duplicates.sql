-- ================================================
-- STEP 1: IDENTIFY DUPLICATE REVIEWS
-- ================================================
-- Run this first to see what duplicates exist

SELECT 
  user_id,
  agency_id,
  COUNT(*) as review_count,
  array_agg(id ORDER BY created_at DESC) as review_ids,
  array_agg(created_at ORDER BY created_at DESC) as review_dates
FROM reviews
GROUP BY user_id, agency_id
HAVING COUNT(*) > 1
ORDER BY review_count DESC;

-- This will show you all duplicate reviews
-- The first ID in each array is the NEWEST review (we'll keep this one)
-- The rest will be deleted

-- ================================================
-- STEP 2: DELETE DUPLICATE REVIEWS (KEEP NEWEST)
-- ================================================
-- This will keep the most recent review from each user and delete older ones

WITH duplicates AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (
      PARTITION BY user_id, agency_id 
      ORDER BY created_at DESC
    ) as rn
  FROM reviews
)
DELETE FROM reviews
WHERE id IN (
  SELECT id 
  FROM duplicates 
  WHERE rn > 1
);

-- This query will:
-- 1. For each (user_id, agency_id) pair, number the reviews by date (newest = 1)
-- 2. Delete all reviews where row_number > 1 (older duplicates)
-- 3. Keep the most recent review from each user

-- ================================================
-- STEP 3: VERIFY NO DUPLICATES REMAIN
-- ================================================

SELECT 
  user_id,
  agency_id,
  COUNT(*) as review_count
FROM reviews
GROUP BY user_id, agency_id
HAVING COUNT(*) > 1;

-- Should return 0 rows if cleanup successful
