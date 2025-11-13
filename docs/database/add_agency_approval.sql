-- Add approval status fields to agencies table
ALTER TABLE public.agencies 
  ADD COLUMN approval_status text NOT NULL DEFAULT 'pending' 
    CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  ADD COLUMN rejection_reason text,
  ADD COLUMN approved_at timestamptz,
  ADD COLUMN reviewed_by uuid REFERENCES public.users(id) ON DELETE SET NULL;

-- Add index for filtering by approval status
CREATE INDEX agencies_approval_status ON public.agencies (approval_status);

-- Update RLS policy to only show approved agencies to public
DROP POLICY IF EXISTS "Allow public read access to agencies" ON public.agencies;

CREATE POLICY "Allow public read access to approved agencies"
  ON public.agencies FOR SELECT
  USING (approval_status = 'approved');

-- Allow agency owners to see their own agencies regardless of status
CREATE POLICY "Allow owners to see their own agencies"
  ON public.agencies FOR SELECT
  USING (owner_id IN (
    SELECT id FROM public.users WHERE auth_id = auth.uid()
  ));

-- Allow admins to see all agencies
CREATE POLICY "Allow admins to see all agencies"
  ON public.agencies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE auth_id = auth.uid() AND role = 'admin'
    )
  );

COMMENT ON COLUMN public.agencies.approval_status IS 'Status of agency approval: pending, approved, or rejected';
COMMENT ON COLUMN public.agencies.rejection_reason IS 'Internal reason for rejection (only visible to admins)';
COMMENT ON COLUMN public.agencies.approved_at IS 'Timestamp when the agency was approved';
COMMENT ON COLUMN public.agencies.reviewed_by IS 'User ID of the admin who reviewed the agency';
