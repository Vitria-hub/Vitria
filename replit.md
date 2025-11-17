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