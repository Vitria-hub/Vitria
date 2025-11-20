# Overview

Vitria is a directory platform for the Chilean market, connecting marketing, branding, and advertising agencies with potential clients. Its purpose is to become the leading agency directory in Chile by offering advanced search, review management, premium listings, integrated payments, detailed analytics, and SEO-optimized content, thereby fostering the local marketing community.

# User Preferences

Preferred communication style: Simple, everyday language.

# Recent Changes

## Quote Request System Bug Fixes (November 20, 2025)

Critical fixes for quote request functionality:

- **Quote Table Creation & RLS Setup**: Created missing `quote_requests` table in Supabase Cloud with proper RLS policies
  - Added insert policy allowing all authenticated users to create quotes
  - Added select/update policies for authenticated users to view their own quotes
  - Fixed foreign key references: `client_user_id` → `users(id)`, `agency_id` → `agencies(id)`
  
- **QuoteRequestModal Foreign Key Fix**: Fixed critical bug in quote submission
  - **Problem**: Used `user.id` (Supabase auth_id) instead of `userData.id` (database user ID)
  - **Solution**: Changed line 86 in `QuoteRequestModal.tsx` to use `userData?.id` 
  - Now correctly references `users.id` table primary key for foreign key constraint
  
- **Client Profile Budget Range Update**: Fixed validation errors in client profile forms
  - Updated `app/dashboard/perfil/page.tsx` to use new budget values: "Menos de 1M", "1-3M", "3-5M", "5M+"
  - Replaced old symbolic values ("$", "$$", "$$$") causing enum validation errors
  - Updated TypeScript types in `lib/supabase.ts` for `client_profiles.budget_range`
  - Changed grid from 3 columns to responsive 2/4 columns for better mobile layout
  - Both registration flow (`/auth/registro/cliente/perfil`) and dashboard edit (`/dashboard/perfil`) now synchronized
  - Updated `QuoteRequestModal.tsx` budget selector to match client profile values for consistency
  - Migrated existing Supabase data from old to new values using SQL UPDATE statement

## Quote Request UX & WhatsApp Rebranding (November 20, 2025)

Mejoras en la experiencia del usuario del formulario de cotización y estandarización de terminología:

- **Eliminación de Redundancia en Formulario de Cotización**:
  - `QuoteRequestModal` ahora pre-llena automáticamente nombre y email para usuarios autenticados
  - Usa `useEffect` con `useAuth` para obtener `userData.full_name` y `user.email`
  - Los campos se mantienen pre-llenados tras `resetForm` para usuarios logueados
  - Mejora UX: usuarios no necesitan ingresar datos que ya están en su perfil
  - Evita fricción innecesaria en el proceso de solicitud de cotización

- **Actualización de Categorías en Formulario de Cotización**:
  - Selector de "Categoría del Servicio" ahora muestra las 6 categorías consolidadas:
    * Performance & Ads
    * Social Media
    * Diseño y Branding
    * Desarrollo Web
    * Producción de Contenido
    * Relaciones Públicas
  - Eliminadas categorías antiguas (Marketing Digital, Branding, Diseño Gráfico, etc.)
  - Consistencia con el sistema de categorías actualizado en toda la plataforma

- **Cambio Sistemático de "Teléfono" a "WhatsApp"**:
  - Refleja preferencia del mercado latinoamericano por WhatsApp como canal principal de contacto
  - **Componentes actualizados**: QuoteRequestModal, ContactAgencyModal
  - **Formularios actualizados**: crear-agencia, editar-perfil, admin/editar-agencia
  - **Validadores actualizados**: lib/validators.ts (mensajes de error)
  - **Páginas de gestión**: mi-agencia/analytics ("Clicks en WhatsApp"), mi-agencia/leads, admin/agencias
  - **Documentación legal**: FAQ, Términos de Servicio, Política de Privacidad
  - Cambio cosmético: internamente el campo sigue siendo `phone` en base de datos, solo cambian labels/placeholders/mensajes
  - Campo admin "WhatsApp (Premium)" renombrado a "WhatsApp Adicional (Premium)" para claridad

## Category Expansion & Analytics Fix (November 20, 2025)

Expanded category structure to 6 categories and fixed critical bugs:

- **Category Expansion**: Expanded from 5 to 6 balanced categories for better marketplace segmentation:
  - **Performance & Ads**: SEO, SEM, paid advertising (Google Ads, Meta Ads, analytics)
  - **Social Media**: Community management, influencer marketing, RRSS strategy
  - **Diseño y Branding**: Logo design, brand identity, graphic design, packaging
  - **Desarrollo Web**: Website development, e-commerce, mobile apps, UX/UI
  - **Producción de Contenido**: Audiovisual production, copywriting, photography, content marketing
  - **Relaciones Públicas**: RRPP, corporate communications, crisis management, events
  - Split "Marketing Digital" into "Performance & Ads" + "Social Media" for clearer service distinction
  - Homepage grid updated to 3 columns (lg:grid-cols-3) creating balanced 3x2 visual layout
  - Updated `lib/categories.ts` with comprehensive service lists for each category

- **Category Counting Bug Fix**: Fixed critical deduplication issue in `getCategoryCounts`:
  - **Problem**: Agencies with multiple legacy categories were counted multiple times per consolidated category
  - **Solution**: Implemented Set-based deduplication to count unique agencies only
  - Maps all legacy category IDs to consolidated IDs before counting
  - Legacy mapping covers all 8 original IDs: publicidad-digital, estrategia-consultoria, publicidad → performance-ads | contenido-redes → social-media | diseno-grafico → branding-identidad | video-fotografia → produccion-contenido | relaciones-publicas, desarrollo-web (self-map)
  - Ensures accurate counts: each agency counted once per consolidated category regardless of legacy tags

- **Dashboard Analytics Fix**: Replaced mock metrics with real data from `getMyAgencyAnalytics`:
  - Added `quotesReceived` field to analytics endpoint for accurate lead tracking
  - Dashboard (`app/dashboard/page.tsx`) now displays actual data: views, clicks, contacts, quotesReceived
  - New agencies correctly show 0 metrics instead of inflated mock numbers
  - Maintains authenticated-only access to preserve registration incentive

- **Dynamic Category Counts**: Homepage category cards display real-time agency counts (implemented November 19):
  - Created `getCategoryCounts` tRPC endpoint (`server/routers/agency.ts`) that aggregates approved agencies by category
  - Created server-side caller (`app/_trpc/serverClient.ts`) for Next.js App Router server components (public procedures only)
  - Modified homepage (`app/page.tsx`) to async server component that fetches real category statistics
  - Each category card dynamically shows accurate agency count (e.g., "1 agencia", "0 agencias")
  - Category cards link to filtered agency listings (`/agencias?category=X`)
  - Installed `server-only` package for server-side-only module imports
  - **Legacy ID Mapping**: Centralized in `lib/categoryMapping.ts` for backward compatibility without database migration
    - Agency listing filter expands new category IDs to search all legacy IDs
    - Ensures end-to-end functionality: homepage counts → category links → filtered listings show correct agencies

- **Google Maps Review Import**: Bulk imported 25 five-star reviews to Scale Lab agency profile:
  - Added `author_name` column to reviews table for non-user reviews
  - Created import script (`scripts/reimport-reviews-with-dates.ts`) with realistic date distribution
  - Reviews span October 2024 to November 2025 for natural timeline appearance
  - Automatically updates agency avg_rating and reviews_count after import
  - Scale Lab now displays 5.0-star rating with 25 reviews

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

Price ranges have been standardized from symbolic values ($, $$, $$$) to clear monetary values (e.g., "Menos de 1M", "1-3M", "3-5M", "5M+" CLP) across all forms and display components. Added "Menos de 1M" range to accommodate smaller agencies with lower minimum project budgets (November 20, 2025).

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