# Overview

Vitria is an agency directory platform for the Chilean market, connecting marketing, branding, and advertising agencies with clients. It offers advanced search, review management, premium listings, integrated payments, comprehensive analytics, and SEO-optimized blog content. Built with a Next.js 14 monorepo using the App Router, tRPC for type-safe APIs, and Supabase for authentication and PostgreSQL, Vitria aims to be the leading agency directory in Chile, providing a modern, user-friendly experience for both agencies and clients. The platform's core vision is to build a community, not just a listing service, by bridging the gap between agencies and clients in Chile, facilitating mutual growth, and strengthening the local marketing ecosystem.

# Recent Changes

## November 12, 2025 - Sistema de Registro y Tracking de Clientes (MVP)

Implementado el sistema base para registro de clientes y tracking de contactos con agencias:

**Nuevas Tablas de Base de Datos**:
- `client_profiles`: Almacena información del negocio/proyecto del cliente (nombre, Instagram, presupuesto, categorías buscadas)
- `agency_contacts`: Tabla de tracking para saber qué clientes contactan qué agencias y por qué medio

**Flujos de Registro Separados**:
- Página selectora en `/auth/registro` donde el usuario elige si es Cliente o Agencia
- Registro de clientes en `/auth/registro/cliente` con wizard de 2 pasos:
  * Paso 1: Datos de cuenta (nombre, email, contraseña)
  * Paso 2: Datos del negocio (nombre negocio, Instagram, presupuesto $/$$/$$, categorías que busca, descripción proyecto)
- Router tRPC `client` con endpoints para crear y gestionar perfiles de clientes

**Validadores y Schemas**:
- `createClientProfileSchema`: Validación de datos de perfil de cliente
- `trackAgencyContactSchema`: Validación para tracking de contactos

**Pendiente para Segunda Iteración**:
- Modificar botones de contacto para requerir autenticación y guardar en `agency_contacts`
- Dashboard de leads para agencias mostrando clientes que las contactaron
- Actualizar sistema de reseñas para mostrar nombre real del autor
- Dashboard para clientes con historial de contactos y favoritos

## November 12, 2025 - Category Migration Script & Loading States

**Migration Script for Production**:
- Created `scripts/migrate-categories.sql` to migrate existing agencies from legacy `services` to new `categories`
- Maps 40+ legacy service names (e.g., "Marketing Digital", "Branding") to 8 simplified main categories
- Safe to run multiple times: includes duplicate checks and proper WHERE clause precedence
- Documented in `scripts/README.md` with Supabase SQL Editor instructions
- Maintains backward compatibility by keeping `services` field intact

**UX Improvements - Loading States**:
- Replaced basic text loading indicator with animated skeleton loader in `/agencias` page
- Skeleton shows 6 placeholder cards with pulse animation during data fetching
- Triggers on both initial load (`isLoading`) and filter/search refetches (`isFetching`)
- Provides immediate visual feedback, eliminating user confusion about app responsiveness

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend uses Next.js 14 with the App Router, combining server and client components. It follows an Atomic Design pattern with reusable, type-safe components styled using TailwindCSS and `class-variance-authority`. A custom design system with brand colors (primary: #1B5568, accent: #F5D35E) ensures UI consistency. tRPC React Query hooks manage state and data fetching, providing caching and invalidation. The UI features a simplified category system for agency search, a community-focused homepage with clear CTAs, and a comprehensive blog system with SEO optimization. Mobile responsiveness is implemented across all components, including navigation and carousels.

## Backend Architecture

The backend utilizes tRPC for a type-safe RPC-style API, with route handlers organized by domain and input validation via Zod. A single API endpoint processes all requests. Data access is managed directly through the Supabase client using a query builder. Business logic encompasses advanced agency filtering (supporting both new category and legacy service parameters), a review moderation system, comprehensive metrics tracking for agencies, and sponsored content management. Analytics endpoints include secure tracking for views, contacts, and searches, with admin-only access for KPIs and agency performance ranking.

## Database Design

Supabase (PostgreSQL) serves as the database, featuring tables for `users`, `agencies`, `reviews`, `portfolio_items`, `agency_metrics_daily`, `sponsored_slots`, and `subscriptions`. It uses UUID primary keys and foreign key relationships. Key tables store owner relationships, service categories, and rating information, while `agency_metrics_daily` tracks time-series data. Database indexing is optimized for performance, especially for carousel and analytics queries.

## Authentication System

Supabase Auth handles email/password authentication and user sessions. A role-based authorization model (`user`, `agency`, `admin`) is enforced, with protected tRPC procedures validating session tokens and verifying ownership. The onboarding process allows role selection, and agency owners can securely manage their profiles.

## SEO Implementation

SEO is managed using the `next-seo` package for global and page-specific metadata. `next-sitemap` generates `sitemap.xml` and `robots.txt` post-build. Blog content is structured with H2/H3, Q&A formats, and rich media for AI and search engine optimization.

## Analytics System

A comprehensive analytics infrastructure tracks user interactions, including agency profile views, contact button clicks, and detailed search analytics (queries, filters, results, zero-result searches). Frontend tracking uses custom React hooks with smart deduplication. The backend provides tRPC endpoints for tracking with service role authentication, and an admin dashboard displays real-time KPIs, top agency rankings, and allows data export with period filters. Agency owners have a dedicated dashboard to view their specific performance metrics, including views, contacts, conversion rates, and top keywords.

# External Dependencies

## Core Infrastructure

- **Supabase**: PostgreSQL database, authentication, and file storage.
- **Stripe**: Payment processing and webhooks (integrated, but currently disabled).

## Frontend Libraries

- **lucide-react**: Icon library.
- **class-variance-authority, clsx, tailwind-merge**: UI styling and class composition.
- **@tanstack/react-query, @trpc/client, @trpc/react-query, @trpc/next**: Type-safe API communication and data management.
- **recharts**: Charting library for analytics visualizations.
- **react-markdown, remark-gfm**: Markdown rendering for blog content.

## Backend Libraries

- **@trpc/server**: Core tRPC framework.
- **zod**: Schema validation.
- **@supabase/supabase-js**: Supabase client for database interactions.

## Development Tools

- **TypeScript**: Type safety.
- **ESLint, Prettier**: Code quality and formatting.
- **PostCSS, Autoprefixer**: CSS processing.
- **ts-node, next-sitemap**: Development utilities and build processes.