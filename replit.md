# Overview

Vitria is a directory platform designed for the Chilean market, aiming to connect marketing, branding, and advertising agencies with potential clients. The platform's primary goal is to become the leading agency directory in Chile by offering features such as advanced search capabilities, comprehensive review management, premium listing options, integrated payment solutions, detailed analytics, and SEO-optimized blog content. Ultimately, Vitria seeks to cultivate and expand the local marketing community.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend

The frontend is built using Next.js 14 (App Router), adhering to Atomic Design principles. It utilizes React server and client components, styled with TailwindCSS and `class-variance-authority`. A custom design system defines brand colors (primary: #1B5568, accent: #F5D35E). Data fetching and state management are handled by tRPC React Query hooks. Key features include a simplified agency category system, a community-focused homepage with clear Calls-to-Action (CTAs), an SEO-optimized blog, and full mobile responsiveness. The agency detail page prioritizes a "Request a Quote" flow for trackable interactions.

## Backend

The backend is developed with tRPC for a type-safe RPC-style API and uses Zod for robust input validation. It interacts with Supabase for data access and implements business logic for advanced agency filtering, review moderation, agency performance tracking, and sponsored content management. Secure analytics endpoints feed data to an admin-only performance dashboard. A comprehensive quote request system is a core feature, including client submission, agency viewing, and admin management.

## Database

Supabase (PostgreSQL) is used for data storage, with tables for `users`, `agencies`, `reviews`, `portfolio_items`, `agency_metrics_daily`, and `quote_requests`. It uses UUID primary keys, foreign key relationships with CASCADE behaviors, and optimized indexing. Row Level Security (RLS) is enabled for granular access control.

## Authentication and Authorization

Supabase Auth manages email/password and Google OAuth, supporting role-based authorization (`user`, `agency`, `admin`). Email verification is disabled to facilitate immediate user access. The system includes an OAuth Role Preservation System and a password recovery flow. New agencies require manual approval via an admin panel. Dual roles (client and agency) are supported.

## SEO

SEO is implemented using `next-seo` for metadata management and `next-sitemap` for generating `sitemap.xml` and `robots.txt`. Blog content is structured for optimal search engine indexing.

## Analytics

A comprehensive analytics system tracks agency profile views, contact clicks, search queries, and critical quote lifecycle metrics (received, contacted, won). Frontend tracking uses custom React hooks, while backend tRPC endpoints record interaction data. An admin dashboard provides Key Performance Indicators (KPIs), agency rankings, and conversion funnels, while agency owners can access their specific performance metrics.

## Premium Management

Premium agency status, indicated by a gold badge, is manually managed by administrators through an admin panel, allowing activation, deactivation, and expiration date setting.

## Admin Control System

A comprehensive admin panel allows administrators to fully manage all aspects of agency profiles, including basic information, contact details, location, categories, services, images, team size, pricing, technical specialties, and social media links.

# External Dependencies

## Core Infrastructure

-   **Supabase**: PostgreSQL database, authentication, and file storage (`agency-logos` bucket).
-   **Stripe**: Payment processing (integrated but disabled).
-   **Brevo (formerly Sendinblue)**: Transactional email delivery for welcome emails and quote notifications.

## Frontend Libraries

-   **lucide-react**: Icon library.
-   **class-variance-authority, clsx, tailwind-merge**: UI styling utilities.
-   **@tanstack/react-query, @trpc/client, @trpc/react-query, @trpc/next**: Type-safe API communication and data management.
-   **recharts**: Charting library.
-   **react-markdown, remark-gfm**: Markdown rendering.
-   **next-seo**: SEO metadata management.
-   **next-sitemap**: Sitemap and robots.txt generation.

## Backend Libraries

-   **@trpc/server**: Core tRPC framework.
-   **zod**: Schema validation.
-   **@supabase/supabase-js**: Supabase client.