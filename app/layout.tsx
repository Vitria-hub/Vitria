import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Providers } from '@/lib/providers';

export const metadata: Metadata = {
  title: 'Vitria - Directorio de Agencias de Marketing en Chile',
  description: 'Encuentra la agencia ideal para tu negocio. Conecta con las mejores agencias de marketing, publicidad y diseño en Chile.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
