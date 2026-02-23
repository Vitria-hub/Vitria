import type { Metadata } from 'next';
import { serverClient } from '@/app/_trpc/serverClient';
import AgencyDetailClient from './AgencyDetailClient';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params;

  try {
    const caller = await serverClient();
    const agency = await caller.agency.getBySlug({ slug }) as any;

    if (!agency) return { title: 'Agencia no encontrada' };

    const title = `${agency.name} — Agencia en ${agency.location_city || 'Chile'}`;
    const description = agency.description
      ? agency.description.substring(0, 160).replace(/\s+/g, ' ').trim()
      : `Conoce a ${agency.name}, agencia de ${(agency.services || []).slice(0, 3).join(', ')} en Chile. Ver perfil, reseñas y solicitar cotización gratis.`;

    return {
      title,
      description,
      alternates: { canonical: `/agencias/${slug}` },
      openGraph: {
        title,
        description,
        url: `https://vitria.cl/agencias/${slug}`,
        type: 'profile',
        ...(agency.logo_url && { images: [{ url: agency.logo_url, alt: agency.name }] }),
      },
      twitter: {
        card: 'summary',
        title,
        description,
      },
    };
  } catch {
    return { title: 'Agencia no encontrada' };
  }
}

export default async function AgencyDetailPage({ params }: PageProps) {
  const { slug } = params;

  // Server-side fetch for JSON-LD (SEO)
  let agency: any = null;
  try {
    const caller = await serverClient();
    agency = await caller.agency.getBySlug({ slug }) as any;
  } catch {
    // Agency not found — client will handle the 404 UI
  }

  // Build JSON-LD schemas for SEO
  const jsonLd = agency ? {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": agency.name,
    "description": agency.description || '',
    "url": `https://vitria.cl/agencias/${slug}`,
    ...(agency.logo_url && { "logo": agency.logo_url, "image": agency.logo_url }),
    ...(agency.email && { "email": agency.email }),
    ...(agency.phone && { "telephone": agency.phone }),
    ...(agency.website && { "sameAs": [agency.website] }),
    ...(agency.location_city && {
      "address": {
        "@type": "PostalAddress",
        "addressLocality": agency.location_city,
        "addressRegion": agency.location_region || '',
        "addressCountry": "CL",
      },
    }),
    ...(agency.avg_rating > 0 && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": String(agency.avg_rating),
        "reviewCount": String(agency.reviews_count || 1),
        "bestRating": "5",
      },
    }),
    ...(agency.services && agency.services.length > 0 && {
      "makesOffer": agency.services.map((s: string) => ({
        "@type": "Offer",
        "itemOffered": { "@type": "Service", "name": s },
      })),
    }),
  } : null;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://vitria.cl" },
      { "@type": "ListItem", "position": 2, "name": "Agencias", "item": "https://vitria.cl/agencias" },
      ...(agency ? [{ "@type": "ListItem", "position": 3, "name": agency.name, "item": `https://vitria.cl/agencias/${slug}` }] : []),
    ],
  };

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <AgencyDetailClient slug={slug} />
    </>
  );
}
