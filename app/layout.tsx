import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Providers } from '@/lib/providers';

export const metadata: Metadata = {
  title: 'Agencias - Directorio de Agencias de Marketing en Chile',
  description: 'El directorio más completo de agencias de marketing, branding y publicidad en Chile',
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
