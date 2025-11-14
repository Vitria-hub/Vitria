-- Add approval status fields to agencies table
ALTER TABLE public.agencies 
  ADD COLUMN IF NOT EXISTS approval_status text NOT NULL DEFAULT 'pending' 
    CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  ADD COLUMN IF NOT EXISTS rejection_reason text,
  ADD COLUMN IF NOT EXISTS approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS reviewed_by uuid REFERENCES public.users(id) ON DELETE SET NULL;

-- Add index for filtering by approval status
CREATE INDEX IF NOT EXISTS agencies_approval_status ON public.agencies (approval_status);

-- Update RLS policy to only show approved agencies to public
DROP POLICY IF EXISTS "Allow public read access to agencies" ON public.agencies;

CREATE POLICY "Allow public read access to approved agencies"
  ON public.agencies FOR SELECT
  USING (approval_status = 'approved');

-- Note: RLS policies using auth.uid() only work in Supabase production environment
-- For development, we rely on application-level filtering in tRPC endpoints
-- In production Supabase, add these additional policies:
--
-- CREATE POLICY "Allow owners to see their own agencies"
--   ON public.agencies FOR SELECT
--   USING (owner_id IN (
--     SELECT id FROM public.users WHERE auth_id = auth.uid()
--   ));
--
-- CREATE POLICY "Allow admins to see all agencies"
--   ON public.agencies FOR SELECT
--   USING (
--     EXISTS (
--       SELECT 1 FROM public.users 
--       WHERE auth_id = auth.uid() AND role = 'admin'
--     )
--   );

COMMENT ON COLUMN public.agencies.approval_status IS 'Status of agency approval: pending, approved, or rejected';
COMMENT ON COLUMN public.agencies.rejection_reason IS 'Internal reason for rejection (only visible to admins)';
COMMENT ON COLUMN public.agencies.approved_at IS 'Timestamp when the agency was approved';
COMMENT ON COLUMN public.agencies.reviewed_by IS 'User ID of the admin who reviewed the agency';
