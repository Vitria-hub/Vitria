# Agency Approval Review Process

## Overview

All newly created agencies on Vitria must go through a manual approval process before being visible to public users. This ensures quality control and prevents spam or inappropriate content.

## User Flow

### 1. Agency Creation
When a user creates a new agency:
- Agency is created with `approval_status: 'pending'`
- Two emails are automatically sent:
  - **Admin notification** to contacto@vitria.cl with agency details
  - **Waitlist confirmation** to the agency owner

### 2. Admin Review
Administrators can review pending agencies through the admin panel:
- View all agency details
- Approve the agency (makes it public)
- Reject the agency with an internal reason

### 3. Post-Review
- **If Approved**: Agency owner receives approval email with link to their live profile
- **If Rejected**: Agency stays hidden with rejection reason stored for admin reference

## Technical Implementation

### Database Schema

New columns added to `agencies` table:
```sql
approval_status TEXT NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected'))
rejection_reason TEXT
approved_at TIMESTAMPTZ
reviewed_by UUID REFERENCES users(id)
```

### Email Templates (via Brevo)

1. **Review Notification** (`sendAgencyReviewEmail`)
   - Recipient: contacto@vitria.cl
   - Contains: All agency details, owner info, approve/reject buttons
   
2. **Waitlist Confirmation** (`sendAgencyWaitlistEmail`)
   - Recipient: Agency owner
   - Message: Informs they're on the waitlist (24-48 hour review)
   
3. **Approval Notification** (`sendAgencyApprovalEmail`)
   - Recipient: Agency owner
   - Contains: Congratulations message, link to live agency profile

### API Endpoints

**Public Endpoints:**
- `agency.list` - Only returns approved agencies
- `agency.getBySlug` - Only returns approved agencies
- `agency.myAgency` - Returns owner's agency regardless of status

**Admin-Only Endpoints:**
- `admin.approveAgency({ agencyId })` - Approves an agency
- `admin.rejectAgency({ agencyId, rejectionReason })` - Rejects an agency

### Visibility Rules

| User Type | Can See Pending | Can See Approved | Can See Rejected |
|-----------|-----------------|------------------|------------------|
| Public    | No              | Yes              | No               |
| Owner     | Yes (own only)  | Yes (own only)   | Yes (own only)   |
| Admin     | Yes (all)       | Yes (all)        | Yes (all)        |

## Testing Checklist

### Prerequisites
- [ ] Brevo API key configured in environment variables
- [ ] Admin user account created in database
- [ ] Database migration applied (add_agency_approval.sql)

### Test Steps

#### 1. Create New Agency
- [ ] Register as a new user
- [ ] Complete agency creation wizard
- [ ] Verify you receive waitlist confirmation email
- [ ] Verify agency is NOT visible in public listings
- [ ] Verify agency IS visible in your dashboard
- [ ] Verify admin email sent to contacto@vitria.cl

#### 2. Admin Approval
- [ ] Log in as admin user
- [ ] Navigate to admin panel
- [ ] Find the pending agency
- [ ] Click approve
- [ ] Verify agency owner receives approval email
- [ ] Verify agency is now visible in public listings

#### 3. Admin Rejection
- [ ] Create another test agency
- [ ] Log in as admin
- [ ] Reject the agency with a reason
- [ ] Verify agency stays hidden from public
- [ ] Verify rejection reason is stored
- [ ] Verify owner does NOT receive rejection email (by design)

#### 4. Edge Cases
- [ ] Try to approve an already-approved agency (should show error)
- [ ] Try to reject an already-rejected agency (should show error)
- [ ] Approve a previously rejected agency (should clear rejection reason)
- [ ] Verify email failures don't block agency creation

## Email Configuration

### Brevo Setup
1. Log in to Brevo account at https://app.brevo.com
2. Navigate to Settings → SMTP & API → API Keys
3. Copy API key to `BREVO_API_KEY` environment variable
4. Sender email: `noreply@vitria.cl` (configure in Brevo if needed)

### Email Customization
Email templates are in `lib/email.ts`:
- Modify HTML templates to match brand guidelines
- Update sender name/email if needed
- Adjust email copy for tone and messaging

## Production Deployment

### Pre-Deployment
1. Run database migration in production Supabase:
   ```sql
   -- See docs/database/add_agency_approval.sql
   ```

2. Add production RLS policies in Supabase dashboard:
   ```sql
   CREATE POLICY "Allow owners to see their own agencies"
     ON public.agencies FOR SELECT
     USING (owner_id IN (
       SELECT id FROM public.users WHERE auth_id = auth.uid()
     ));

   CREATE POLICY "Allow admins to see all agencies"
     ON public.agencies FOR SELECT
     USING (
       EXISTS (
         SELECT 1 FROM public.users 
         WHERE auth_id = auth.uid() AND role = 'admin'
       )
     );
   ```

3. Verify `BREVO_API_KEY` is set in production environment

4. Update existing agencies to approved status (if needed):
   ```sql
   UPDATE public.agencies 
   SET approval_status = 'approved' 
   WHERE approval_status = 'pending';
   ```

### Post-Deployment
- Monitor admin email (contacto@vitria.cl) for review notifications
- Set up admin review process/schedule
- Track approval/rejection metrics in admin dashboard
