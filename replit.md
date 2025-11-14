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

## Authentication and Authorization

Supabase Auth handles email/password and Google OAuth, supporting role-based authorization (`user`, `agency`, `admin`). A robust OAuth Role Preservation System uses a database-first approach to ensure consistent role assignment for existing users, with a cookie-based fallback and manual selection for new users when automated detection fails. An "OAuth Callback Session Cookie Fix" ensures proper session creation after OAuth. Email/password authentication allows immediate login post-registration without email confirmation. The system supports dual roles (client and agency) with optional profile creation managed via CTAs on the user dashboard, rather than forced onboarding. A full password recovery flow is implemented. New agencies undergo a manual approval process, including email notifications and admin-only approval/rejection via tRPC endpoints, before becoming publicly visible.

## SEO

SEO is managed using `next-seo` for metadata and `next-sitemap` for `sitemap.xml` and `robots.txt` generation. Blog content is structured for optimal indexing.

## Analytics

A comprehensive analytics system tracks agency profile views, contact clicks, and search analytics (queries, filters, results). Frontend tracking uses custom React hooks, while backend tRPC endpoints, secured with service role authentication, record data. An admin dashboard provides real-time KPIs and agency rankings, and agency owners have access to their specific performance metrics.

## Premium Management

Currently, premium status for agencies is manually managed by administrators through an admin panel, allowing activation, deactivation, and setting expiration dates. Premium agencies display a distinctive gold badge. A dual-layer strategy ensures premium expiration: real-time verification at query-time and scheduled cleanup via external cron jobs. Future plans include automated premium subscription management via Stripe.

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