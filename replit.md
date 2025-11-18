# Overview

Vitria is a directory platform for the Chilean market, connecting marketing, branding, and advertising agencies with clients. Its goal is to be the leading agency directory in Chile, offering advanced search, review management, premium listings, integrated payments, comprehensive analytics, and SEO-optimized blog content. The platform aims to foster community growth within the local marketing ecosystem.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend

The frontend uses Next.js 14 (App Router) with Atomic Design principles, React server and client components, TailwindCSS, and `class-variance-authority` for styling. A custom design system defines brand colors (primary: #1B5568, accent: #F5D35E). Data fetching and state management are handled by tRPC React Query hooks. It features a simplified agency category system, a community-focused homepage with clear CTAs, an SEO-optimized blog, and is fully mobile-responsive.

## Backend

The backend is built with tRPC for a type-safe RPC-style API and Zod for input validation. It leverages the Supabase client for data access and includes business logic for advanced agency filtering, review moderation, agency metrics tracking, and sponsored content management. Secure analytics endpoints feed an admin-only performance dashboard.

## Database

Supabase (PostgreSQL) stores data in tables such as `users`, `agencies`, `reviews`, `portfolio_items`, and `agency_metrics_daily`. It uses UUID primary keys, foreign key relationships with CASCADE behaviors, and optimized indexing for performance. Custom `public.users` table links to `auth.users`, and automated triggers manage review aggregates. Row Level Security (RLS) is enabled for granular access control.

## Authentication and Authorization

Supabase Auth handles email/password and Google OAuth, supporting role-based authorization (`user`, `agency`, `admin`). **Email verification is disabled** to ensure users can register and access the platform immediately without waiting for confirmation emails. The system includes an OAuth Role Preservation System, a "OAuth Callback Session Cookie Fix," and a full password recovery flow. New agencies undergo a manual approval process via an admin panel before becoming public. The system supports dual roles (client and agency) with optional profile creation.

## SEO

SEO is managed using `next-seo` for metadata and `next-sitemap` for `sitemap.xml` and `robots.txt` generation. Blog content is structured for optimal indexing.

## Analytics

A comprehensive analytics system tracks agency profile views, contact clicks, and search queries. Frontend tracking uses custom React hooks, while backend tRPC endpoints record data. An admin dashboard provides KPIs and agency rankings, and agency owners access their specific metrics.

## Premium Management

Premium agency status is manually managed by administrators via an admin panel, allowing activation, deactivation, and setting expiration dates, indicated by a gold badge. A dual-layer strategy ensures premium expiration through real-time verification and scheduled cleanup.

# Recent Changes

## November 18, 2025 - Quote Request System (MVP Feature)
- **Complete Quote/Lead System**: Implemented comprehensive quote request system to reduce friction between clients and agencies
  - **Database**: Created `quote_requests` table with fields:
    - Client info: client_name, client_email, client_phone, client_user_id (nullable)
    - Project details: project_name, project_description, budget_range, service_category
    - Tracking: status enum (pending/contacted/won/lost), created_at, updated_at
    - Foreign keys: agency_id → agencies, client_user_id → users (nullable)
    - Optimized indexes on agency_id, client_user_id, status, created_at
  - **Backend tRPC Router** (`server/routers/quotes.ts`):
    - `submitQuote`: Public endpoint for submitting quotes with email fallback logic
      - If agency.email is null, falls back to owner's email from auth.users
      - Throws clear error if neither email exists to prevent silent failures
    - `getAgencyQuotes`: Protected endpoint for agency owners to view their received quotes
    - `getAllQuotes`: Admin-only endpoint with filtering and pagination
    - `updateQuoteStatus`: Admin endpoint for tracking quote conversion (pending → contacted → won/lost)
  - **QuoteRequestModal Component**: Replaced simple ContactAgencyModal with structured quote form
    - Fields: client name, email, phone (optional), project name, description, budget range, service category
    - HTML5 validation with required fields, min/max lengths
    - Clear error messaging with fallback text
    - Success state with branded confirmation message
  - **Email Notifications** (via Brevo):
    - `sendQuoteNotificationToAgency`: Sends lead notification to agency with all project details
    - `sendQuoteConfirmationToClient`: Sends confirmation to client with next steps
    - Both emails use Vitria branding (Quicksand font, isotipo, color scheme)
  - **Admin Dashboard** (`/admin/cotizaciones`):
    - KPIs: Total quotes, contacted quotes, won quotes, conversion rates
    - Filterable table by status with search
    - Top agencies by quote volume
    - Status update functionality
    - "Gestionar Cotizaciones" card added to admin panel home
  - **Agency Owner Dashboard** (`/dashboard` tab):
    - New "Cotizaciones" tab showing all received quotes
    - Quote count badge in tab label
    - Full quote details with client contact info
    - "Contactar Cliente" button (mailto link)
    - Empty state when no quotes received
  - **Frontend Integration**: QuoteRequestModal replaces ContactAgencyModal in agency profile pages
  - **Analytics Tracking**: Quote submissions logged to `interaction_logs` as 'form_submit' type
  - Impact: This is the **core MVP feature** for launch, enabling measurement of value delivered to agencies and clients

- **Analytics Dashboard Fix**: Created missing SQL functions
  - Created `get_agency_view_stats()` function to aggregate view data from interaction_logs
  - Created `get_agency_contact_stats()` function to aggregate contact/click data
  - Fixed admin analytics dashboard that was failing due to missing database functions
  - Impact: Analytics will display correctly once frontend tracking is verified and data flows

## November 18, 2025 - Complete Admin Control System
- **Admin Panel Full Autonomy**: Implemented comprehensive agency editing system giving administrators complete control over all platform content
  - **Expanded Edit Form** (`/admin/agencias/[id]/editar`): Now includes ALL agency fields:
    - Basic info: name, slug, description, email, phone, website
    - Location: city, region
    - Categories and services (multiple selection)
    - Images: logo_url, cover_url with URL validation
    - Team size: employees_min, employees_max (nullable fields)
    - Pricing: price_range ($, $$, $$$, or null)
    - Technical specialties: array of technologies/skills
    - **Social media links**: facebook_url, instagram_url, linkedin_url, twitter_url, youtube_url, tiktok_url
  - **Database Schema Updates**: Added 6 new columns to `agencies` table for social media URLs via ALTER TABLE
  - **TypeScript Types Updated**: Enhanced `lib/supabase.ts` to include all new social media fields
  - **Backend Validation**: Enhanced `admin.updateAgency` tRPC endpoint with:
    - Proper nullable handling for employees_min/max
    - Enum validation for price_range with null support
    - Optional specialties array
    - URL validation for all social media fields
    - Smart null conversion for empty strings
  - Impact: Administrators now have "control absoluto" over every aspect of agency profiles

- **Bug Fixes**:
  - **Review Count Display**: Fixed CarouselSponsored showing 0 reviews for agencies with existing reviews
    - Changed `agency.review_count` → `agency.reviews_count` (correct plural field name)
    - Changed `agency.average_rating` → `agency.avg_rating` (correct database field name)
    - Impact: Featured agencies now display accurate review counts and ratings
  
- **Blog Visual Improvements**: Generated unique cover images for all blog posts
  - Created 4 professional AI-generated images to replace duplicated stock photos
  - Images generated and saved to `/public/stock_images/`:
    - `choosing-marketing-agency-guide.png` - Professional business meeting scene
    - `marketing-agency-pricing-costs.png` - Financial planning and budgets
    - `avoiding-marketing-mistakes.png` - Warning symbols and best practices
    - `agency-vs-inhouse-comparison.png` - Side-by-side workspace comparison
  - Updated `lib/blog/posts.ts` to use unique images for each post
  - Impact: Every blog post now has a distinct, contextually relevant cover image

## November 17, 2025 - Email System Improvements
- **Welcome Email Visual Update**: Updated welcome email to match homepage design exactly
  - Changed typography to Quicksand font (imported from Google Fonts)
  - Replaced generic logo with authentic Vitria isotipo (4 rounded squares in brand colors)
  - Isotipo colors: #1B5568 (primary), #6F9CEB (secondary), #64D5C3 (mint), #F5D35E (accent)
  - Maintains consistent visual identity across all user touchpoints

- **Full Name Storage Fix**: Fixed bug where full_name wasn't saved in auth.users for email/password registrations
  - Updated `signUp()` function in `lib/auth.ts` to save full_name in Supabase Auth metadata
  - Now both Google OAuth and email/password registrations store name in `auth.users.raw_user_meta_data`
  - Ensures "Display name" appears correctly in Supabase Dashboard for all registration methods

- **Production URL Fix**: Fixed critical bug where admin notification emails linked to development instead of production
  - Updated `getBaseUrl()` function in `lib/email.ts` to detect environment correctly
  - Uses `REPLIT_DEPLOYMENT=1` to identify production environment
  - Admin notification emails now correctly link to `https://vitria.cl` in production
  - Development emails continue to use `REPLIT_DEV_DOMAIN` for local testing
  - Impact: Admins reviewing new agencies in production are now directed to production admin panel

## November 17, 2025 - Professional Flyer-Style Welcome Email
- **Feature**: Automated welcome email sent to all new users upon registration
- **Design**: Professional flyer-style email template with premium visual design:
  - Hero banner with gradient background (#1B5568 → #134551) and decorative radial elements
  - Modern logo badge with rounded corners (20px border-radius)
  - Accent bar in Vitria yellow (#F5D35E) for visual separation
  - High-contrast buttons: primary (white text on dark gradient), secondary (dark text on white with 3px border)
  - Highlight box with double-border effect (white border + yellow outline)
  - Feature cards with subtle gradients, yellow left borders, and enhanced shadows
  - Professional dark footer (#1B5568) with yellow accents (#F5D35E)
- **Personalization**: Content adapts based on user role (client vs agency) with specific benefits and CTAs
- **Content**: Explains Vitria's mission, platform benefits, and provides direct links to dashboard and agency directory
- **Implementation**:
  - Created `sendWelcomeEmail()` function in `lib/email.ts` using Brevo API
  - Integrated into user creation flow (`app/api/auth/create-user/route.ts`)
  - Email sending is non-blocking - registration completes even if email fails
  - Fully responsive design with mobile optimizations
  - Fallback name "Amigo" if user's name is empty
- **Email Provider**: Brevo (formerly Sendinblue) for reliable transactional email delivery
- **Impact**: Creates strong first impression with professional, branded design that reinforces Vitria's premium positioning

## November 17, 2025 - Email Verification Made Optional
- **Issue**: Users in production reported not receiving registration emails, blocking their ability to use the platform
- **Solution**: Removed all email verification requirements to prioritize user onboarding and platform accessibility
- **Code Changes**: 
  - Updated `lib/auth.ts` signUp to set `emailRedirectTo: undefined`
  - Removed "Email not confirmed" checks from login page (`app/auth/login/page.tsx`)
  - Removed email confirmation checks from agency registration flow (`app/auth/registro/agencia/page.tsx`)
  - Removed email confirmation checks from client registration flow (`app/auth/registro/cliente/page.tsx`)
- **Configuration**: Email verification is disabled in Supabase Dashboard (Authentication → Providers → Email → "Confirm email" toggle OFF)
- **Impact**: Users can now register and immediately access the platform without waiting for confirmation emails, significantly improving conversion rates
- **User Experience**: Registration flows (both client and agency) now proceed directly to dashboard after account creation

# External Dependencies

## Core Infrastructure

-   **Supabase**: PostgreSQL database, authentication, and file storage (`agency-logos` bucket).
-   **Stripe**: Payment processing (integrated but disabled).

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