-- Migration to ensure only one cohort can be active at a time
-- First, ensure only one cohort is active (keep the most recent one)
WITH ranked_cohorts AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) as rn
  FROM cohorts
  WHERE is_active = true
)
UPDATE cohorts
SET is_active = false
WHERE id IN (SELECT id FROM ranked_cohorts WHERE rn > 1);

-- Create a partial unique index to prevent multiple active cohorts
CREATE UNIQUE INDEX idx_cohorts_single_active
ON cohorts (is_active)
WHERE is_active = true;
