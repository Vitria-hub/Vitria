import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Directorio de Agencias de Marketing en Chile',
  description: 'Encuentra y compara las mejores agencias de marketing, publicidad, diseño, branding y desarrollo web en Chile. Reseñas reales, cotizaciones gratis y contacto directo.',
  alternates: { canonical: '/agencias' },
  openGraph: {
    title: 'Directorio de Agencias de Marketing en Chile | Vitria',
    description: 'Encuentra y compara las mejores agencias de marketing, publicidad, diseño, branding y desarrollo web en Chile.',
    url: 'https://vitria.cl/agencias',
  },
};

export default function AgenciasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
