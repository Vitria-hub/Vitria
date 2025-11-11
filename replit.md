# Overview

**Vitria** is an agency directory platform designed for the Chilean market, connecting marketing, branding, and advertising agencies with clients. It features advanced search, review management, premium listings, integrated payments, and a comprehensive analytics system. The platform is built as a Next.js 14 monorepo using the App Router, tRPC for type-safe APIs, and Supabase for authentication and PostgreSQL database management. Vitria aims to be the leading directory for agencies in Chile, offering a modern, user-friendly experience for both agencies and clients.

# Recent Changes

## November 11, 2025 - Analytics System Implementation

Implemented complete analytics infrastructure to track user interactions and demonstrate value to premium agencies:

- **Backend Analytics Router**: Created tRPC endpoints for tracking views, contacts, and searches with secure service role authentication
- **Admin Dashboard**: Enhanced with real-time KPIs showing total searches, contacts generated, and growth metrics
- **Analytics Page**: Built dedicated `/admin/analytics` page with interactive charts (recharts), top 10 agency ranking, CSV export, and period filters
- **Tracking System**: Custom React hook (`useTracking`) for automatic event logging across the platform
- **Database Optimization**: Created SQL functions for aggregated queries and performance indexes
- **Security**: Implemented strict validation, UUID checks, and admin-only access controls

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built with Next.js 14 using the App Router, combining server and client components. It employs an Atomic Design pattern with reusable, type-safe components managed by `class-variance-authority` and styled using TailwindCSS. A custom design system with branded colors (primary: #1B5568, accent: #F5D35E) ensures consistent UI. State management and data fetching are handled via tRPC React Query hooks, providing automatic caching and invalidation.

## Backend Architecture

The backend leverages tRPC for a type-safe RPC-style API, organizing route handlers by domain (e.g., agency, review) with Zod for input validation. A single API endpoint (`/api/trpc/[trpc]/route.ts`) processes all requests. Data access directly uses the Supabase client with a query builder pattern. Business logic includes advanced agency filtering, a review moderation system, metrics tracking, and managing sponsored content.

## Database Design

Supabase (PostgreSQL) is the chosen database, featuring tables for `users`, `agencies`, `reviews`, `portfolio_items`, `agency_metrics_daily`, `sponsored_slots`, and `subscriptions`. UUID primary keys and foreign key relationships are used. Key tables like `agencies` store owner relationships, service categories, and rating information, while `agency_metrics_daily` tracks time-series data.

## Authentication System

Supabase Auth provides email/password authentication and manages user sessions. A role-based authorization model (`user`, `agency`, `admin`) is enforced, with protected tRPC procedures validating session tokens and verifying ownership. The onboarding flow allows users to select roles, and agency owners can create and manage their profiles securely.

## SEO Implementation

SEO is managed using the `next-seo` package for global and page-specific metadata, and `next-sitemap` for generating `sitemap.xml` and `robots.txt` post-build.

# External Dependencies

## Core Infrastructure

- **Supabase**: Provides PostgreSQL database, authentication services, and file storage for images.
- **Stripe**: Handles payment processing for subscriptions and manages webhooks (currently disabled but integrated).

## Frontend Libraries

- **lucide-react**: Icon library.
- **class-variance-authority, clsx, tailwind-merge**: For UI component styling and class composition.
- **@tanstack/react-query, @trpc/client, @trpc/react-query, @trpc/next**: For type-safe API communication and data management.

## Backend Libraries

- **@trpc/server**: Core tRPC framework.
- **zod**: Schema validation.
- **@supabase/supabase-js**: Supabase client for database interactions.

## Development Tools

- **TypeScript**: For type safety.
- **ESLint, Prettier**: For code quality and formatting.
- **PostCSS, Autoprefixer**: For CSS processing.
- **ts-node, next-sitemap**: For development utilities and build processes.