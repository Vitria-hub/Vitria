# Directorio de Agencias - Next.js 14

Directorio completo de agencias de marketing, branding y publicidad en Chile. Monorepo construido con Next.js 14, TypeScript, TailwindCSS, tRPC, Supabase y Stripe.

## ✨ Características

- 🎨 **Branding personalizado** con Quicksand y paleta de colores corporativa
- 🏢 **Directorio de agencias** con búsqueda, filtros y ordenamiento
- ⭐ **Sistema de reseñas** con moderación y cálculo automático de ratings
- 💎 **Planes Free/Premium** con integración Stripe
- 📊 **Dashboard de agencias** con métricas diarias y gestión de perfil
- 🎯 **Carrusel de agencias patrocinadas** en home
- 🔍 **SEO optimizado** con next-seo y next-sitemap
- 📱 **Diseño responsive** con TailwindCSS
- 🔒 **Autenticación** con Supabase Auth
- 🚀 **Type-safe APIs** con tRPC y Zod

## 🛠️ Stack Tecnológico

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** TailwindCSS, CVA, Lucide Icons
- **API:** tRPC, Zod
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Payments:** Stripe
- **SEO:** next-seo, next-sitemap

## 🚀 Configuración Inicial

### 1. Crear proyecto Supabase

1. Crear cuenta en [Supabase](https://supabase.com)
2. Crear nuevo proyecto
3. En SQL Editor, ejecutar el contenido de `database/schema.sql`
4. Copiar las credenciales (Project URL y Anon Key)

### 2. Configurar variables de entorno

Copiar `.env.local.example` a `.env.local` y rellenar:

```bash
cp .env.local.example .env.local
```

Editar `.env.local` con tus credenciales:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
SUPABASE_SERVICE_ROLE=tu_service_role_key (opcional, para seed)

STRIPE_SECRET_KEY=tu_stripe_secret_key
NEXT_PUBLIC_STRIPE_PK=tu_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=tu_stripe_webhook_secret

NEXT_PUBLIC_SITE_URL=http://localhost:5000
```

### 3. Configurar Stripe

1. Crear cuenta en [Stripe](https://stripe.com)
2. Obtener API keys desde Dashboard
3. Crear producto "Plan Premium" con precio recurrente mensual
4. Configurar webhook endpoint: `http://localhost:5000/api/stripe/webhook`
   - Eventos: `checkout.session.completed`, `invoice.payment_failed`, `customer.subscription.deleted`
5. Copiar webhook signing secret

### 4. Instalar dependencias y ejecutar seed

```bash
npm install
npm run seed
```

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:5000](http://localhost:5000)

## 📁 Estructura del Proyecto

```
├── app/                      # Next.js App Router
│   ├── agencias/            # Listado y detalle de agencias
│   ├── blog/                # Blog
│   ├── dashboard/           # Panel de agencia
│   ├── api/                 # API Routes (tRPC, Stripe webhook)
│   ├── layout.tsx           # Layout principal
│   └── page.tsx             # Home
├── components/              # Componentes reutilizables
│   ├── Button.tsx
│   ├── AgencyCard.tsx
│   ├── FilterBar.tsx
│   ├── ReviewForm.tsx
│   └── ...
├── lib/                     # Utilidades y configuración
│   ├── supabase.ts
│   ├── trpc.ts
│   ├── validators.ts
│   └── utils.ts
├── server/                  # Backend tRPC
│   ├── routers/            # Routers tRPC
│   ├── db.ts
│   └── trpc.ts
├── seed/                    # Script de seed de datos
├── database/                # SQL schemas
└── public/                  # Assets estáticos
```

## 🎨 Paleta de Colores

```css
primary:   #1B5568  /* Teal oscuro */
accent:    #F5D35E  /* Amarillo dorado */
secondary: #6F9CEB  /* Azul cielo */
lilac:     #BCBDF6  /* Lila */
lilacDark: #9893DA  /* Lila oscuro */
mint:      #64D5C3  /* Menta */
dark:      #20262E  /* Gris oscuro */
```

## 📦 Scripts Disponibles

```bash
npm run dev         # Desarrollo (puerto 5000)
npm run build       # Build de producción
npm start           # Ejecutar build
npm run seed        # Poblar base de datos
npm run lint        # Linter
```

## 🔐 Autenticación

El proyecto usa Supabase Auth con Email + Magic Link. Para configurar otros proveedores (Google, LinkedIn):

1. En Supabase Dashboard → Authentication → Providers
2. Habilitar proveedor deseado
3. Configurar OAuth credentials

## 💳 Suscripciones

- **Plan Free:** Acceso básico, perfil público, reseñas
- **Plan Premium ($49/mes):** Badge Premium, carrusel destacado, portafolio ilimitado, métricas avanzadas

## 📊 Base de Datos

El proyecto incluye:

- **20 agencias de ejemplo** (5 Premium)
- **3-5 reseñas aprobadas** por agencia
- **Portafolio** para agencias Premium
- **Slots patrocinados** activos
- **Métricas diarias** de ejemplo

## 🚢 Deployment

```bash
npm run build
```

El proyecto está configurado para deployarse en cualquier plataforma que soporte Next.js:

- Vercel (recomendado)
- Netlify
- Railway
- Self-hosted

Recuerda actualizar `NEXT_PUBLIC_SITE_URL` en producción y configurar el webhook de Stripe con la URL de producción.

## 📝 Notas

- El carrusel de agencias patrocinadas solo muestra agencias con slots activos
- Las reseñas quedan en estado `pending` hasta ser aprobadas
- Los ratings se calculan automáticamente via triggers de PostgreSQL
- El dashboard permite ver métricas básicas (views, clicks, leads)

## 🤝 Contribuir

Este es un proyecto de demostración. Para uso en producción, considera:

- Implementar autenticación completa con roles
- Agregar validaciones server-side adicionales
- Configurar rate limiting
- Optimizar imágenes y assets
- Configurar CDN
- Implementar tests

## 📄 Licencia

MIT
