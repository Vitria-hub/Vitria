# Overview

Vitria is an agency directory platform for the Chilean market, connecting marketing, branding, and advertising agencies with clients. Its core purpose is to be the leading agency directory in Chile, offering advanced search, review management, premium listings, integrated payments, comprehensive analytics, and SEO-optimized blog content. The platform aims to foster a community by bridging the gap between agencies and clients, facilitating mutual growth, and strengthening the local marketing ecosystem.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built with Next.js 14 and the App Router, utilizing a combination of server and client components. It follows an Atomic Design pattern with reusable, type-safe components styled using TailwindCSS and `class-variance-authority`. A custom design system defines brand colors (primary: #1B5568, accent: #F5D35E) for UI consistency. tRPC React Query hooks handle state and data fetching, including caching and invalidation. The UI features a simplified category system for agency search, a community-focused homepage with clear Calls to Action (CTAs), and an SEO-optimized blog. Mobile responsiveness is implemented across all components.

## Backend Architecture

The backend uses tRPC for a type-safe RPC-style API, with route handlers organized by domain and input validation via Zod. A single API endpoint processes all requests. Data access is managed through the Supabase client. Business logic includes advanced agency filtering (supporting both categories and legacy services), a review moderation system, comprehensive metrics tracking for agencies, and sponsored content management. Analytics endpoints securely track views, contacts, and searches, with an admin-only dashboard for KPIs and performance ranking.

## Database Design

Supabase (PostgreSQL) is the database, featuring tables for `users`, `agencies`, `reviews`, `portfolio_items`, `agency_metrics_daily`, `sponsored_slots`, `subscriptions`, `client_profiles`, and `agency_contacts`. It uses UUID primary keys and foreign key relationships, storing owner relationships, service categories, and rating information. `agency_metrics_daily` tracks time-series data. Database indexing is optimized for performance, particularly for carousel and analytics queries.

## Authentication System

Supabase Auth manages email/password and Google OAuth authentication, along with user sessions. A role-based authorization model (`user`, `agency`, `admin`) is enforced, with protected tRPC procedures validating session tokens and verifying ownership. The onboarding process includes role selection, and agency owners can securely manage their profiles. OAuth callbacks handle role assignment and redirection to onboarding flows for clients and agencies.

**Password Recovery Flow:** Complete password reset functionality allows users to recover forgotten passwords via email. Users request a recovery link at `/auth/recuperar-contrasena`, receive a time-limited token via email, and update their password at `/auth/actualizar-contrasena`. The flow includes token validation, password strength requirements (min 6 chars), and automatic session termination post-update. Server-side middleware protects admin (`/admin`) and agency (`/mi-agencia`) routes with role-based access control.

## SEO Implementation

SEO is managed using the `next-seo` package for global and page-specific metadata. `next-sitemap` generates `sitemap.xml` and `robots.txt` post-build. Blog content is structured with H2/H3, Q&A formats, and rich media for optimal indexing.

## Analytics System

A comprehensive analytics infrastructure tracks user interactions such as agency profile views, contact button clicks, and detailed search analytics (queries, filters, results, zero-result searches). Frontend tracking uses custom React hooks with smart deduplication. The backend provides tRPC endpoints for tracking with service role authentication. An admin dashboard displays real-time KPIs, top agency rankings, and allows data export. Agency owners have a dedicated dashboard to view their specific performance metrics.

## Premium Management System

**Phase 1 (Current): Manual Admin Management**
The platform features a manual premium management system operated by administrators. Admins can activate/deactivate premium status for agencies through the admin panel (`/admin/agencias`), selecting from preset durations (30/90/365 days) or custom date ranges. The system automatically calculates and stores expiration dates in the `premium_until` field. Premium agencies display a distinctive gold badge with crown icon on agency cards and profile pages. The schema includes an optional `whatsapp_number` field to support the hybrid contact model: basic agencies use trackable contact forms, while premium agencies can offer direct WhatsApp contact.

**Premium Expiration Automation (Dual-Layer Strategy):**
The platform uses a two-layer approach to ensure premium status expires automatically:

1. **Query-Time Verification**: All agency queries automatically check `premium_until` and demote expired agencies in real-time using `enforcePremiumFreshness` helpers. This guarantees users never see stale premium flags even if scheduled cleanup fails.

2. **Scheduled Cleanup**: External cron service (cron-job.org, GitHub Actions, or Vercel Cron) calls `/api/cron/expire-premium` hourly/daily. This endpoint is protected with `CRON_SECRET` environment variable (configured in Replit Secrets). Manual cleanup is also available via `admin.cleanExpiredPremium` tRPC endpoint.

**Cron Setup Instructions:**
- Add `CRON_SECRET` to Replit Secrets (generate random string)
- Configure external cron to call: `POST https://vitria.replit.app/api/cron/expire-premium`
- Add header: `Authorization: Bearer YOUR_CRON_SECRET`
- Recommended frequency: Every hour or daily at midnight

**Phase 2 (Planned): Stripe Automation**
Future integration will automate premium subscription management via Stripe, handling payments, renewals, and automatic expiration enforcement.

# External Dependencies

## Core Infrastructure

- **Supabase**: PostgreSQL database, authentication, and file storage.
- **Stripe**: Payment processing and webhooks (integrated, but currently disabled).

## Frontend Libraries

- **lucide-react**: Icon library.
- **class-variance-authority, clsx, tailwind-merge**: UI styling and class composition.
- **@tanstack/react-query, @trpc/client, @trpc/react-query, @trpc/next**: Type-safe API communication and data management.
- **recharts**: Charting library for analytics visualizations.
- **react-markdown, remark-gfm**: Markdown rendering for blog content.

## Backend Libraries

- **@trpc/server**: Core tRPC framework.
- **zod**: Schema validation.
- **@supabase/supabase-js**: Supabase client for database interactions.