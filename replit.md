# Overview

Vitria is a directory platform for the Chilean market, designed to connect marketing, branding, and advertising agencies with clients. Its primary goal is to become the leading agency directory in Chile by offering advanced search capabilities, review management, premium listing options, integrated payments, comprehensive analytics, and SEO-optimized blog content. The platform aims to build a community that facilitates mutual growth and strengthens the local marketing ecosystem.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend

The frontend is built with Next.js 14 (App Router), utilizing Atomic Design principles with React server and client components. Styling is managed with TailwindCSS and `class-variance-authority`, adhering to a custom design system with brand-specific colors (primary: #1B5568, accent: #F5D35E). Data fetching and state management are handled by tRPC React Query hooks. The UI features a simplified agency category system, a community-focused homepage with clear CTAs, and an SEO-optimized blog, all designed for mobile responsiveness.

## Backend

The backend uses tRPC for a type-safe RPC-style API, with Zod for input validation. It features a single API endpoint and uses the Supabase client for data access. Key business logic includes advanced agency filtering, a review moderation system, comprehensive agency metrics tracking, and sponsored content management. Analytics endpoints securely track user interactions, providing data for an admin-only performance dashboard.

## Database

Supabase (PostgreSQL) is used for the database, with tables for `users`, `agencies`, `reviews`, `portfolio_items`, `agency_metrics_daily`, `sponsored_slots`, `subscriptions`, `client_profiles`, and `agency_contacts`. It employs UUID primary keys, foreign key relationships, and optimized indexing for performance, particularly for carousels and analytics queries.

### Database Architecture
- **Custom Users Table**: Uses `public.users` table with `auth_id` FK to `auth.users` (recommended Supabase pattern for application data separation)
- **Data Integrity**: Enforced via NOT NULL constraints, UNIQUE constraints (auth_id, slug, user_id), and prevention of duplicate reviews
- **Cascade Behaviors**: CASCADE deletes for owned resources (agency→metrics/portfolio), SET NULL for analytics preservation
- **Automated Triggers**: Auto-sync for review aggregates (avg_rating, reviews_count) via database triggers
- **Performance Indexes**: 9 strategic indexes covering analytics queries, admin moderation, user history, and dashboard loading
- **Materialized Views**: `agency_analytics_summary` for optimized dashboard performance
- **Row Level Security**: RLS enabled on all tables with granular access policies (production-only, requires auth.uid())

## Authentication and Authorization

Supabase Auth handles email/password and Google OAuth, supporting role-based authorization (`user`, `agency`, `admin`). A robust OAuth Role Preservation System uses a database-first approach to ensure consistent role assignment for existing users, with a cookie-based fallback and manual selection for new users when automated detection fails. An "OAuth Callback Session Cookie Fix" ensures proper session creation after OAuth. Email/password authentication allows immediate login post-registration without email confirmation. The system supports dual roles (client and agency) with optional profile creation managed via CTAs on the user dashboard, rather than forced onboarding. A full password recovery flow is implemented. New agencies undergo a manual approval process, including email notifications and admin-only approval/rejection via tRPC endpoints, before becoming publicly visible.

## SEO

SEO is managed using `next-seo` for metadata and `next-sitemap` for `sitemap.xml` and `robots.txt` generation. Blog content is structured for optimal indexing.

## Analytics

A comprehensive analytics system tracks agency profile views, contact clicks, and search analytics (queries, filters, results). Frontend tracking uses custom React hooks, while backend tRPC endpoints, secured with service role authentication, record data. An admin dashboard provides real-time KPIs and agency rankings, and agency owners have access to their specific performance metrics.

## Premium Management

Currently, premium status for agencies is manually managed by administrators through an admin panel, allowing activation, deactivation, and setting expiration dates. Premium agencies display a distinctive gold badge. A dual-layer strategy ensures premium expiration: real-time verification at query-time and scheduled cleanup via external cron jobs. Future plans include automated premium subscription management via Stripe.

# Recent Changes

## November 15, 2025 - Complete Admin Control for Sponsored Agencies & Premium Management
- **Sponsored Slots API**: Created 4 new admin endpoints (addSponsoredSlot, updateSponsoredSlot, removeSponsoredSlot, listSponsoredSlots) in adminRouter
- **Agency Management Page Enhancement**: Added "Destacar" button (purple star icon) to approved agencies in /admin/agencias, opens modal to configure position (1-5) and duration (7/15/30 days or custom)
- **Dedicated Sponsored Page**: New /admin/destacados page shows all sponsored slots with status badges (Active/Expired/Programado), allows extending duration or removing slots
- **Admin Navigation**: Added "Agencias Destacadas" card to main admin dashboard with direct access to sponsored slot management
- **Backend Validations**: Prevents highlighting non-approved agencies, detects position conflicts for overlapping time periods, provides clear error messages
- **User Feedback**: Added success/error alerts for all sponsored slot operations (add, update, remove)
- **Visual Status Indicators**: Slots display active status, premium badges, days remaining, and clear start/end dates
- **Impact**: Admins now have complete control over homepage carousel without needing database access or scripts

## November 15, 2025 - Admin Dashboard Improvements
- **Admin Experience**: Admins now see a clean dashboard with direct access to admin panel instead of profile errors
- **Error Suppression**: Removed misleading "Error al cargar" messages for admins who don't need agency/client profiles
- **Admin CTA**: Added prominent admin panel access card with link to `/admin` on dashboard
- **Role Detection**: Dashboard now checks user role and hides irrelevant CTAs for admins
- **Impact**: Cleaner UX for administrators, no more confusing error messages about missing profiles

## November 14, 2025 - Admin Access Control UX Improvement
- **User Experience**: Non-admin users who click "Revisar Agencia" in approval emails now see clear error message
- **Centralized Pattern**: Created `app/admin/layout.tsx` with AdminGuard to eliminate duplicated auth logic
- **Reusable Component**: `AdminAccessDenied` component displays helpful message: "Debes iniciar sesión como administrador"
- **Middleware Update**: Changed middleware to allow logged-in non-admins through (shows error message) while redirecting unauthenticated users
- **Code Cleanup**: Removed redundant `useAuth()`, `useRouter()`, and `useEffect()` checks from individual admin pages
- **Impact**: Better UX for users clicking email links, cleaner codebase with less duplication

## November 14, 2025 - Client Profile Budget Range Constraint Fix
- **Critical Database Fix**: Fixed budget_range constraint mismatch in production Supabase database
- **Root Cause**: Production database had outdated constraint values ('low', 'medium', 'high') while application code uses ('$', '$$', '$$$')
- **Impact**: Client profile creation was completely blocked with constraint violation error
- **Solution**: Executed SQL migration in production to update constraint and migrate existing data
- **Dual Role System**: Platform correctly supports users having both agency profile (with price_range for what they charge) and client profile (with budget_range for what they want to spend)
- **SQL Fix**: `production-fix-budget-range-constraint.sql` script created for future reference

## November 14, 2025 - Flexible URL Normalization Implementation
- **Feature**: Implemented smart URL normalization that accepts website URLs with or without `https://` protocol
- **User Experience**: Users can now enter URLs in natural formats: "vitria.cl", "www.vitria.cl", or "https://vitria.cl"
- **Technical Solution**: Created `optionalUrlSchema` using `z.preprocess()` to normalize URLs before validation
- **Normalization Logic**: Automatically adds `https://` prefix if no protocol is detected, while preserving existing protocols
- **Impact**: Reduces user friction during agency registration - no more "URL inválido" errors from missing protocols
- **UI Updates**: Changed input type from "url" to "text", updated placeholder to indicate protocol is optional
- **Fields Affected**: website, logo_url (in both createAgencySchema and updateAgencySchema)

## November 14, 2025 - Database Integrity & Performance Overhaul
- **Data Integrity**: Added critical constraints (NOT NULL, UNIQUE) on users.auth_id, agencies.slug, client_profiles.user_id, and reviews(user_id, agency_id)
- **Cascade Protection**: Implemented ON DELETE CASCADE/SET NULL across all foreign keys to prevent orphaned data
- **Performance**: Added 9 strategic indexes for high-volume queries (metrics, reviews, analytics, contacts)
- **Automation**: Created triggers for auto-sync of denormalized aggregates (avg_rating, reviews_count)
- **Analytics**: Built materialized view `agency_analytics_summary` for fast dashboard loading
- **Security**: Enabled RLS on all tables (policies require production Supabase setup)
- **Documentation**: Created `database-migration-summary.md` with production setup guide

## November 14, 2025 - UX Performance Improvements
- **Navigation**: Added Next.js TopLoader for instant visual feedback on page transitions
- **Loading States**: Enhanced Button component with loading prop and animated spinners
- **User Feedback**: Implemented loading states across 12 critical user flows (auth, agency management, reviews, contacts)
- **Perceived Performance**: Eliminated "waiting in silence" issue with immediate visual feedback on all button clicks

## November 14, 2025 - Admin Panel Approval Workflow Consolidation
- **Workflow Simplification**: Consolidated from dual "verify" (cosmetic badge) + "approve" (visibility control) to single "Approve/Reject" workflow
- **Approval Status**: Admin list now filters by `approval_status` (pending/approved/rejected) instead of obsolete `is_verified` flag
- **Email Notifications**: Approval workflow properly triggers email notifications to agency owners via Brevo
- **Review UX**: Added agency detail modal allowing admins to review full agency information before approving/rejecting
- **Rejection Workflow**: Implemented rejection reason requirement with modal input, stored in database for future reference
- **Default Filter**: Admin panel defaults to "pending" agencies for faster review queue processing
- **Action Visibility**: Approve/Reject buttons only visible for pending agencies, preventing accidental status changes

# External Dependencies

## Core Infrastructure

-   **Supabase**: PostgreSQL database, authentication, and file storage. Requires `agency-logos` bucket setup with public read and authenticated upload policies.
-   **Stripe**: Payment processing (currently integrated but disabled).

## Frontend Libraries

-   **lucide-react**: Icon library.
-   **class-variance-authority, clsx, tailwind-merge**: UI styling.
-   **@tanstack/react-query, @trpc/client, @trpc/react-query, @trpc/next**: Type-safe API communication and data management.
-   **recharts**: Charting library.
-   **react-markdown, remark-gfm**: Markdown rendering.

## Backend Libraries

-   **@trpc/server**: Core tRPC framework.
-   **zod**: Schema validation.
-   **@supabase/supabase-js**: Supabase client.