# Overview

Vitria is a directory platform for the Chilean market, connecting marketing, branding, and advertising agencies with potential clients. Its purpose is to become the leading agency directory in Chile by offering advanced search, review management, premium listings, integrated payments, detailed analytics, and SEO-optimized content, thereby fostering the local marketing community.

# Recent Changes

## November 24, 2025
- **Mobile-First AgencyCard Redesign**: Complete responsive overhaul with minimum 12px typography, 44px touch targets, stacked buttons on mobile (side-by-side on desktop), responsive padding (p-3 → sm:p-4 → md:p-5), and optimized spacing for mobile users
- **Navbar Login Enhancement**: Added LogIn icon to "Iniciar Sesión" button in both mobile and desktop views for better visual hierarchy and user recognition

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend

The frontend uses Next.js 14 (App Router) with Atomic Design principles, React server and client components, and TailwindCSS. It features a custom design system with brand colors (primary: #1B5568, accent: #F5D35E). Data fetching is managed via tRPC React Query hooks. Key features include a simplified agency category system, a community-focused homepage with CTAs, an SEO-optimized blog, and full mobile responsiveness. The agency detail page emphasizes a "Request a Quote" flow, including pre-filled forms for authenticated users and updated budget range values.

**Agency Card Design (Updated Nov 2024)**: Optimized hierarchy following marketplace UX best practices. Cards display: (1) logo and name with Instagram-style blue verification check for premium agencies, (2) star rating and review count prominently, (3) "Recomendado para ti" badge for premium listings, (4) up to 6 bullet points extracted from the agency's "Sobre la Agencia" description (prioritizing bullet-formatted content, falling back to sentences), (5) price range in top-right corner when available (formatted as "$$: 1-3M"), and (6) dual CTAs for premium agencies with WhatsApp (Ver agencia + WhatsApp buttons side-by-side) or single "Ver agencia" CTA for non-premium agencies. Cards use flexbox layout to ensure consistent alignment with buttons always at the bottom regardless of content length. Location data, service tags, and specialties removed to reduce visual clutter and focus on agency-authored content. The `extractDescriptionBullets` utility intelligently parses description text to surface the most relevant information. **Authentication-gated access (Nov 2024)**: All agency detail views and contact actions (Ver agencia, WhatsApp) require authentication. Unauthenticated users are redirected to login with returnUrl preservation to seamlessly return to their intended destination after sign-in.

## Backend

The backend is built with tRPC for a type-safe API and Zod for validation. It integrates with Supabase for data access and implements business logic for agency filtering, review moderation, performance tracking, and sponsored content. Secure analytics endpoints feed an admin dashboard. A comprehensive quote request system is central, covering client submissions, agency viewing, and admin management. Public data access is highly restricted to encourage user registration, requiring authentication for detailed agency information and contact methods. The system also includes an automated profile health score calculation.

## Database

Supabase (PostgreSQL) is used for data storage, including `users`, `agencies`, `reviews`, `portfolio_items`, `agency_metrics_daily`, and `quote_requests` tables. It utilizes UUID primary keys, foreign key relationships, and optimized indexing. Row Level Security (RLS) is enabled for granular access control, ensuring authenticated users can only view their own quotes.

## Authentication and Authorization

Supabase Auth handles email/password and Google OAuth, supporting role-based authorization (`user`, `agency`, `admin`). It includes an OAuth Role Preservation System and password recovery. New agencies require manual admin approval. The system supports dual roles for clients and agencies.

## SEO

SEO is managed using `next-seo` for metadata and `next-sitemap` for `sitemap.xml` and `robots.txt` generation. Blog content is optimized for search engines.

## Analytics

A comprehensive analytics system tracks agency profile views, contact clicks, search queries, and quote lifecycle metrics. Frontend tracking uses custom React hooks, while backend tRPC endpoints record data stored in `interaction_logs` and `quote_requests` tables. The admin dashboard (`/admin`) displays 4 critical KPIs for the MVP: Total Cotizaciones, Usuarios Nuevos, Agencias Nuevas, and Total Búsquedas (last 30 days). A Top 5 Agencias table shows the most viewed agencies with detailed metrics (views, quotes, contacts, ratings). The full analytics dashboard (`/admin/analytics`) provides comprehensive agency rankings sorted by profile views, with support for up to 100,000 records per query. Agencies can access their own performance metrics via `/mi-agencia/analytics`, including `quotesReceived`.

## Premium Management

Premium agency status is manually managed by administrators, offering benefits like direct contact information display (email, phone, website) via a "Ver más formas de contacto" toggle. Non-premium agencies use the platform's quote request system for lead generation. An admin panel (`/admin/agencias/[id]/editar`) allows full management of agency profiles and premium status, including the ability to edit industries/niches, services, categories, and all agency information.

## File Upload System

A comprehensive file upload system uses Replit's Object Storage (App Storage) for agency logos and cover images. It involves a `ObjectStorageService` for signed URLs, `ObjectAcl` for public access, and tRPC endpoints for upload management. A reusable `ObjectUploader` component (using Uppy) is integrated into agency creation and admin edit pages.

## Key Features

-   **Category System**: Expanded to 6 balanced categories (Performance & Ads, Social Media, Diseño y Branding, Desarrollo Web, Producción de Contenido, Relaciones Públicas) with dynamic counts on the homepage and consistent service listing. Legacy category mapping ensures backward compatibility.
-   **Industry/Niche Filtering (Nov 2024)**: Added industry-based search filtering to help clients find agencies specialized in specific sectors (E-commerce, Inmobiliaria, Automotriz, Salud, Educación, Tech/Startups, Retail, Finanzas, Alimentos y Bebidas, Turismo, Moda, Deportes, Entretenimiento, ONG). Industries are stored in the `industries` field of the `agencies` table and filterable via the main agency explorer through a dedicated "Todas las industrias" dropdown selector. The INDUSTRIES constant is centralized in `lib/categories.ts` for consistent usage across creation forms and filtering.
-   **Quote Request System**: Enhanced with foreign key fixes, pre-filled fields for authenticated users, consistent budget ranges, and improved agency contact options (Email and WhatsApp with pre-filled messages).
-   **Terminology Standardization**: Systematic change from "Teléfono" to "WhatsApp" across the platform to reflect regional preferences.
-   **Price Range Standardization**: Standardized monetary values (e.g., "Menos de 1M", "1-3M", "3-5M", "5M+" CLP) across all forms and displays.
-   **Legal Compliance**: Includes a 17-section Privacy Policy, Terms of Service compliant with Chilean legislation, and an FAQ page.

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
-   **server-only**: For server-side-only module imports.

## Backend Libraries

-   **@trpc/server**: Core tRPC framework.
-   **zod**: Schema validation.
-   **@supabase/supabase-js**: Supabase client.