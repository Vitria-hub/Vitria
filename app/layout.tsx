import type { Metadata, Viewport } from 'next';
import { Quicksand } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Providers } from '@/lib/providers';
import NextTopLoader from 'nextjs-toploader';
import { ToastProvider } from '@/contexts/ToastContext';
import { ConfirmProvider } from '@/contexts/ConfirmContext';

const quicksand = Quicksand({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-quicksand',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1B5568',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://vitria.cl'),
  title: {
    default: 'Vitria - Directorio de Agencias en Chile',
    template: '%s | Vitria',
  },
  description: 'Encuentra la agencia ideal para tu negocio. Conecta con las mejores agencias de marketing, publicidad, diseño, desarrollo y más en Chile.',
  keywords: ['agencias chile', 'agencias de marketing', 'publicidad chile', 'diseño gráfico', 'branding', 'agencias digitales', 'desarrollo web'],
  authors: [{ name: 'Vitria' }],
  creator: 'Vitria',
  publisher: 'Vitria',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    url: 'https://vitria.cl',
    siteName: 'Vitria',
    title: 'Vitria - Directorio de Agencias en Chile',
    description: 'Encuentra la agencia ideal para tu negocio. Conecta con las mejores agencias de marketing, publicidad, diseño, desarrollo y más en Chile.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vitria - Directorio de Agencias en Chile',
    description: 'Encuentra la agencia ideal para tu negocio. Conecta con las mejores agencias de marketing, publicidad, diseño, desarrollo y más en Chile.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={quicksand.variable}>
      <head>
        <link rel="alternate" hrefLang="es-cl" href="https://vitria.cl/" />
        <link rel="alternate" hrefLang="x-default" href="https://vitria.cl/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Vitria",
              "url": "https://vitria.cl",
              "logo": "https://vitria.cl/logo.png",
              "description": "Directorio de agencias de marketing, publicidad, diseño y desarrollo en Chile. Encuentra y conecta con la agencia ideal para tu negocio.",
              "areaServed": { "@type": "Country", "name": "Chile" },
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "contacto@vitria.cl",
                "contactType": "customer service",
                "availableLanguage": "Spanish"
              }
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Vitria",
              "url": "https://vitria.cl",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://vitria.cl/agencias?search={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />
      </head>
      <body className={quicksand.className}>
        <NextTopLoader 
          color="#1B5568"
          height={3}
          showSpinner={false}
          easing="ease"
          speed={200}
        />
        <Providers>
          <ToastProvider>
            <ConfirmProvider>
              <Navbar />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </ConfirmProvider>
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
