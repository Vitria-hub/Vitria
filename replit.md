# Overview

**Vitria** is a comprehensive agency directory platform built for the Chilean market, connecting marketing, branding, and advertising agencies with potential clients. The application features an advanced search and filtering system, review management, premium/sponsored listings, and integrated Stripe payments for subscription management. Built as a modern monorepo using Next.js 14 with the App Router, it leverages tRPC for type-safe APIs and Supabase for authentication and PostgreSQL database management.

# Recent Changes (November 2025)

**Deployment Configuration Fixed** (November 11, 2025):
- Corrected run command from `npm start -p 5000` to `npm run start`
- Fixed tRPC client URL to use `window.location.origin` instead of env variable
- Added Suspense boundary to `/agencias` page for proper pre-rendering
- Deployment type: Autoscale with Next.js production server on port 5000

**Typography Implementation** (November 11, 2025):
- **Quicksand Regular (400)**: Applied to all body text and paragraphs
- **Quicksand Bold (700)**: Applied to headings (h1-h6), buttons, and bold text
- Font loaded from Google Fonts CDN
- Configured in both `globals.css` and `tailwind.config.ts`

**Branding Update**: Platform rebranded from "Agencias" to **Vitria**
- Custom logo added to Navbar and Footer components
- All metadata and site references updated
- Logo file stored at `/public/vitria-logo.png`

**Homepage Redesign**: Modern, user-focused design inspired by industry best practices
- **Hero Section**: Enhanced gradient background with statistics (150+ agencies, 4.8★ rating), improved copy, and functional search form
- **Category Section**: Expanded from 4 to 8 specialized categories (Marketing Digital, Publicidad, Diseño y Branding, Contenido, Audiovisual, Desarrollo Web, Relaciones Públicas, Social Media) with icons, descriptions, and agency counts
- **Testimonials**: New section featuring 3 user stories from Chilean entrepreneurs
- **Dual CTAs**: Separate call-to-action cards for agencies and clients, each with branded gradients and listed benefits

**Authentication System Implemented** (November 11, 2025):
- **Supabase Auth Integration**: Complete email/password authentication using Supabase
- **Protected Routes**: tRPC protected procedures with Bearer token validation
- **Login/Register Pages**: Full authentication flow with validation and error handling
- **Auth Context**: Global authentication state management via useAuth hook
- **Dynamic Navbar**: Shows login/register for guests, user menu with logout for authenticated users
- **Session Management**: Automatic session persistence and refresh

**Dashboard & Backoffice** (November 11, 2025):
- **Role-Based Dashboard**: Different views for clients vs agency owners
- **Agency Management**: Complete CRUD operations for agency profiles
- **Create Agency Flow**: Secure agency creation with automatic slug generation and owner_id persistence
- **Agency Profile**: View and edit agency information, manage portfolio
- **Metrics Dashboard**: View analytics (views, clicks, contacts, leads)
- 
**Security Implementation**:
- **Protected Procedures**: All mutations (agency.create) require authentication
- **Ownership Verification**: Agency operations verify owner_id before allowing modifications
- **agency.myAgency Endpoint**: Secure endpoint that returns only user's owned agency
- **Auth Headers**: tRPC client automatically includes Bearer token in requests
- **User Isolation**: Users can only see and modify their own agencies

**Functional Features**:
- **Search Integration**: Hero search form connects to agency listing with URL params
- **Advanced Filters**: Working filters for region, services, price range, and sorting
- **Pagination**: Full pagination support on agency listings
- **Agency Creation**: Complete flow from registration to agency profile

**Design Improvements**:
- Modern card hover effects with smooth transitions
- Better use of brand color palette throughout
- Enhanced typography and spacing
- Professional, polished appearance aligned with modern SaaS platforms

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: Next.js 14 with App Router pattern
- Server and client components coexist, with client components marked with 'use client' directive
- Pages utilize dynamic routing (e.g., `/agencias/[slug]`) for agency detail pages
- Global state management handled through React Query via tRPC hooks
- Responsive design implemented with TailwindCSS utility classes

**Component Design Pattern**: Atomic design with reusable components
- UI components (Button, Input, Badge, etc.) use class-variance-authority (CVA) for variant management
- Shared utility function `cn()` combines clsx and tailwind-merge for className composition
- Components are prop-driven and type-safe with TypeScript interfaces

**Styling Strategy**: Custom design system with branded colors
- Primary color (#1B5568), accent (#F5D35E), and supporting colors defined in both CSS variables and Tailwind config
- Quicksand font family loaded via Google Fonts CDN
- Consistent spacing and border patterns (border-2 border-gray-200 convention)

**State Management**: tRPC React Query integration
- Client-side data fetching through tRPC hooks (e.g., `trpc.agency.list.useQuery()`)
- Mutations for write operations (e.g., `trpc.review.create.useMutation()`)
- Automatic caching and invalidation handled by React Query

## Backend Architecture

**API Layer**: tRPC with Zod validation
- Type-safe RPC-style API eliminating need for REST endpoints
- Input validation using Zod schemas defined in `lib/validators.ts`
- Route handlers organized by domain (agency, review, sponsor, metrics, billing)
- Single API endpoint at `/api/trpc/[trpc]/route.ts` handles all tRPC requests

**Router Organization**: Domain-driven structure
- Root router (`_app.ts`) composes feature-specific routers
- Each domain router (agency, review, etc.) encapsulates related procedures
- Public procedures used throughout (authentication not yet implemented in shown code)

**Data Access Pattern**: Direct Supabase client usage
- Server-side Supabase client (`db`) created with service role key for elevated permissions
- Query builder pattern for database operations (e.g., `db.from('agencies').select()`)
- Complex filtering implemented through chained query methods

**Business Logic Examples**:
- Agency listing with full-text search, multi-field filtering, and custom sorting
- Review system with pending/approved status workflow
- Metrics tracking with daily aggregation using upsert pattern
- Sponsored carousel serving active slots ordered by position

## Database Design

**Platform**: Supabase (PostgreSQL)
- Schema includes users, agencies, reviews, portfolio_items, agency_metrics_daily, sponsored_slots, and subscriptions tables
- UUID primary keys with gen_random_uuid() default
- Relationships enforced through foreign keys with cascade deletes
- Timestamptz for all temporal data

**Key Tables**:
- `agencies`: Core entity with owner relationship, service/category arrays, premium flags, and computed rating fields
- `reviews`: User-generated content with status field for moderation workflow
- `agency_metrics_daily`: Time-series data for views, clicks, and leads tracking
- `sponsored_slots`: Time-bounded premium placements with position ordering

**Indexing Strategy** (implied but not shown):
- Full-text search on agency name and description fields
- Indexes on filter columns (region, city, is_premium, avg_rating)
- Composite indexes for common query patterns (sort by rating + premium status)

## Authentication System

**Provider**: Supabase Auth
- Email/password authentication fully implemented
- Optional social providers (Google, LinkedIn) can be configured in Supabase Dashboard
- Auth state managed globally through custom useAuth hook
- User records linked to auth system via `auth_id` field

**Authorization Model**: Role-based with user/agency/admin roles
- User role stored in users table during registration
- Agency ownership tracked via `owner_id` foreign key
- All protected tRPC procedures verify ownership before mutations
- Bearer token authentication for all protected API routes

**Protected Procedures** (server/trpc.ts):
- `protectedProcedure`: Middleware that validates Supabase session tokens
- Extracts userId from auth token and adds to context
- All agency creation and billing operations use protected procedures
- Throws UNAUTHORIZED error if token missing or invalid

**Onboarding Flow**: Role-specific registration
- Users select "client" or "agency" role during registration
- Agency owners can create agency profile after login
- Automatic slug generation from agency name
- Dashboard access requires authentication (redirects to login)
- Agency creation automatically assigns current user as owner

**Session Management**:
- Sessions persist via Supabase local storage
- Auth state synchronized across tabs
- Automatic token refresh
- Logout clears session and redirects to home

## Payment Processing

**Status**: Currently disabled - Stripe integration removed as it's not commonly used in Chile
- Premium/subscription functionality temporarily disabled
- Database schema supports future payment integration
- Can be re-enabled with local Chilean payment providers (e.g., Transbank, Mercado Pago)

## SEO Implementation

**Meta Management**: next-seo package
- Global metadata in root layout
- Page-specific meta tags should be added to individual pages
- Schema.org structured data for Organization and AggregateRating mentioned for agency detail pages

**Sitemap Generation**: next-sitemap package
- Post-build script generates sitemap.xml and robots.txt
- Configuration allows all user agents
- Site URL configurable via environment variable

## Performance Considerations

**Image Optimization**: Next.js Image component (implied but not shown in detail)
- Logo and cover images stored in Supabase Storage
- Fallback images for missing logos

**Query Optimization**:
- Pagination with limit/offset pattern
- Count queries for total results
- Selective field loading where appropriate

**Caching Strategy**: React Query default behavior
- Automatic background refetching
- Stale-while-revalidate pattern
- Query invalidation on mutations

# External Dependencies

## Core Infrastructure

**Supabase** (PostgreSQL + Auth + Storage)
- Database: PostgreSQL 15+ with full-text search extensions
- Authentication: Email/magic link with optional OAuth providers
- File Storage: Logo and cover image uploads
- Required environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE`

**Stripe** (Payment Processing)
- Checkout Sessions for subscription signup
- Webhooks for payment event handling
- Customer Portal (mentioned but not implemented)
- Required environment variables: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- API version: 2024-12-18.acacia

## Frontend Libraries

**UI Components**:
- lucide-react: Icon library (Star, MapPin, Globe, etc.)
- class-variance-authority: Component variant management
- clsx + tailwind-merge: Conditional className composition

**Data Fetching**:
- @tanstack/react-query: Caching and state management
- @trpc/client, @trpc/react-query, @trpc/next: Type-safe API client

## Backend Libraries

**API Framework**:
- @trpc/server: tRPC server implementation
- zod: Runtime schema validation and type inference

**Database Client**:
- @supabase/supabase-js: Official Supabase JavaScript client

## Development Tools

**Build Tools**:
- TypeScript: Type safety across frontend and backend
- ESLint: Code linting with Next.js preset
- Prettier: Code formatting
- PostCSS + Autoprefixer: CSS processing

**Utilities**:
- ts-node: TypeScript execution for seed scripts
- next-sitemap: Sitemap and robots.txt generation

## Configuration Requirements

**Environment Variables** (see `.env.local.example`):
- Supabase credentials (URL, anon key, service role key)
- Stripe keys (secret key, webhook secret)
- Site URL for callbacks and sitemap generation

**Database Setup**:
- Execute schema SQL from `database/schema.sql` in Supabase SQL Editor
- Run seed script with `npm run seed` to populate sample data

**Third-Party Account Setup**:
1. Create Supabase project and note credentials
2. Create Stripe account and configure webhook endpoint
3. Optional: Configure Google/LinkedIn OAuth apps for social login