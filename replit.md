# Overview

Vitria is a directory platform for the Chilean market, connecting marketing, branding, and advertising agencies with potential clients. Its purpose is to become the leading agency directory in Chile by offering advanced search, review management, premium listings, integrated payments, detailed analytics, and SEO-optimized content, thereby fostering the local marketing community.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend

The frontend uses Next.js 14 (App Router) with Atomic Design principles, React server and client components, and TailwindCSS. It features a custom design system with brand colors (primary: #1B5568, accent: #F5D35E). Data fetching is managed via tRPC React Query hooks. Key features include a simplified agency category system, a community-focused homepage with CTAs, an SEO-optimized blog, and full mobile responsiveness. The agency detail page emphasizes a "Request a Quote" flow.

## Backend

The backend is built with tRPC for a type-safe API and Zod for validation. It integrates with Supabase for data access and implements business logic for agency filtering, review moderation, performance tracking, and sponsored content. Secure analytics endpoints feed an admin dashboard. A comprehensive quote request system is central, covering client submissions, agency viewing, and admin management. Public data access is highly restricted to encourage user registration, requiring authentication for detailed agency information and contact methods.

## Database

Supabase (PostgreSQL) is used for data storage, including `users`, `agencies`, `reviews`, `portfolio_items`, `agency_metrics_daily`, and `quote_requests` tables. It utilizes UUID primary keys, foreign key relationships, and optimized indexing. Row Level Security (RLS) is enabled for granular access control.

## Authentication and Authorization

Supabase Auth handles email/password and Google OAuth, supporting role-based authorization (`user`, `agency`, `admin`). Email verification is disabled. It includes an OAuth Role Preservation System and password recovery. New agencies require manual admin approval. The system supports dual roles for clients and agencies.

## SEO

SEO is managed using `next-seo` for metadata and `next-sitemap` for `sitemap.xml` and `robots.txt` generation. Blog content is optimized for search engines.

## Analytics

A comprehensive analytics system tracks agency profile views, contact clicks, search queries, and quote lifecycle metrics. Frontend tracking uses custom React hooks, while backend tRPC endpoints record data. An admin dashboard provides KPIs, agency rankings, and conversion funnels, with agencies able to access their specific performance metrics.

## Premium Management

Premium agency status is manually managed by administrators, offering benefits like direct contact information display (email, phone, website) via a "Ver más formas de contacto" toggle. Non-premium agencies use the platform's quote request system for lead generation.

## Admin Control System

A comprehensive admin panel allows full management of agency profiles, including basic info, contact details, location, categories, services, images, team size, pricing, technical specialties, and social media links. It also includes features for setting premium status and auto-populating WhatsApp numbers for premium agencies.

## Profile Health System

An automated system calculates a 0-100% profile health score based on weighted completion factors (e.g., logo, cover image, description, social media, portfolio, team size, price range, specialties, categories/services). This is displayed via a `ProfileHealthWidget` on the agency dashboard and as emoji indicators in the admin panel.

## Legal Compliance

The platform includes a 17-section Privacy Policy (`/privacidad`) and Terms of Service (`/terminos`) compliant with Chilean legislation (Law N° 21.719 and Law 19.496). An FAQ page (`/faq`) covers common questions. Registration forms include explicit consent notices for data processing. Premium agency phone numbers display a WhatsApp badge for direct wa.me chats.

## File Upload System

A comprehensive file upload system uses Replit's Object Storage (App Storage) for agency logos and cover images. It involves a `ObjectStorageService` for signed URLs, `ObjectAcl` for public access, and tRPC endpoints for upload management. A reusable `ObjectUploader` component (using Uppy) is integrated into agency creation and admin edit pages. Uploaded images are served via a Next.js catch-all route (`app/objects/[...path]/route.ts`).

## Price Range Standardization

Price ranges have been standardized from symbolic values ($, $$, $$$) to clear monetary values (e.g., "1-3M", "3-5M", "5M+" CLP) across all forms and display components.

## Dynamic Category Counts

Homepage category cards now display real-time agency counts fetched via a tRPC endpoint, dynamically linking to filtered agency listings.

# External Dependencies

## Core Infrastructure

-   **Supabase**: PostgreSQL database and authentication.
-   **Replit Object Storage (App Storage)**: File storage for agency logos and cover images.
-   **Stripe**: Payment processing (integrated but disabled).
-   **Brevo (formerly Sendinblue)**: Transactional email delivery.

## Frontend Libraries

-   **lucide-react**: Icon library.
-   **class-variance-authority, clsx, tailwind-merge**: UI styling utilities.
-   **@tanstack/react-query, @trpc/client, @trpc/react-query, @trpc/next**: Type-safe API communication and data management.
-   **@uppy/core, @uppy/react, @uppy/dashboard, @uppy/aws-s3**: File upload library and S3-compatible storage integration.
-   **recharts**: Charting library.
-   **react-markdown, remark-gfm**: Markdown rendering.
-   **next-seo**: SEO metadata management.
-   **next-sitemap**: Sitemap and robots.txt generation.

## Backend Libraries

-   **@trpc/server**: Core tRPC framework.
-   **zod**: Schema validation.
-   **@supabase/supabase-js**: Supabase client.