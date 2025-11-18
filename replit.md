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

Premium agency status, indicated by a gold badge, is manually managed by administrators through an admin panel, allowing activation, deactivation, and expiration date setting. Premium agencies receive exclusive benefits including the ability to display direct contact information (email, phone, website) on their profile pages via a "Ver más formas de contacto" toggle. Non-premium agencies can only receive leads through the platform's quote request system, ensuring all interactions are tracked and measured for analytics purposes.

## Admin Control System

A comprehensive admin panel allows administrators to fully manage all aspects of agency profiles, including basic information, contact details, location, categories, services, images, team size, pricing, technical specialties, and social media links.

## Profile Health System

An automated profile optimization system helps agencies improve their listing quality through a 0-100% health score. The score is calculated based on 9 weighted completion factors: logo (15%), cover image (10%), description length (15%), social media links (5%), specialties (10%), portfolio items with 3+ threshold (15%), team size (10%), price range (10%), and combined categories/services (10%). The system provides two interfaces: (1) a `ProfileHealthWidget` on the agency analytics dashboard (`/mi-agencia/analytics`) showing a progress bar, completion checklist, and optimization suggestions, and (2) a "Salud" column in the admin panel (`/admin/agencias`) displaying emoji indicators (🟢 ≥80%, 🟡 60-79%, 🟠 40-59%, 🔴 <40%), percentage scores, and missing item counts to help administrators identify agencies needing profile assistance.

## Legal Compliance

The platform includes comprehensive legal documentation aligned with Chilean legislation:

### Privacy Policy (`/privacidad`)
A detailed 17-section privacy policy compliant with Chile's Law N° 21.719 (Data Protection Law, effective December 2026). Key sections include:
- ARCO-P rights (Access, Rectification, Cancellation, Opposition, Portability) with detailed procedures
- Specific data retention schedules (account data, quotes, reviews, payments, logs)
- Data breach notification procedures (APDP notification, user notification criteria)
- International data transfer safeguards (Supabase, Brevo)
- Cookie and tracking technology disclosures
- Automated decision-making and profiling clarifications
- Complaint procedures and APDP contact information
- Last updated: November 18, 2025

### Terms of Service (`/terminos`)
Comprehensive 17-section terms covering platform usage, rights, and obligations:
- Premium billing, renewal, and cancellation policies
- Consumer rights per Law 19.496 (10-day retraction right for paid services)
- Liability limitations adapted to Chilean consumer protection law
- Termination and suspension procedures
- Dispute resolution process (negotiation → mediation → tribunals)
- Force majeure clauses
- Applicable law (Chilean legislation) and jurisdiction (Chilean courts)
- Last updated: November 18, 2025

### FAQ Page (`/faq`)
User-friendly FAQ covering clients, agencies, reviews, privacy, and technical issues. Organized by category with clear, non-technical language aligned with user preferences.

### Registration Consent
Both client and agency registration forms include explicit consent notices (no checkbox) stating: "Al crear tu cuenta, aceptas nuestros Términos de Uso y Política de Privacidad, y consientes expresamente el tratamiento de tus datos personales según lo descrito, incluyendo el almacenamiento, procesamiento y transferencia internacional de datos conforme a la Ley 21.719." Links open terms and privacy policy in new tabs.

### WhatsApp Integration
Premium agency phone numbers display with a green WhatsApp badge containing the official WhatsApp icon and "WhatsApp" label, opening direct wa.me chats with sanitized Chilean phone numbers.

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