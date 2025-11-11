import Hero from '@/components/Hero';
import CarouselSponsored from '@/components/CarouselSponsored';
import Link from 'next/link';
import { Star, Users, Award, TrendingUp } from 'lucide-react';

export default function Home() {
  const categories = [
    { name: 'Marketing Digital', icon: TrendingUp, count: 45 },
    { name: 'Branding', icon: Award, count: 38 },
    { name: 'Diseño', icon: Star, count: 52 },
    { name: 'Relaciones Públicas', icon: Users, count: 28 },
  ];

  return (
    <>
      <Hero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="mb-16">
          <CarouselSponsored />
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-primary">
            Explora por Categoría
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.name}
                  href="/agencias"
                  className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-primary hover:shadow-lg transition text-center"
                >
                  <Icon className="w-12 h-12 mx-auto text-primary mb-4" />
                  <h3 className="font-bold text-lg text-dark">{category.name}</h3>
                  <p className="text-sm text-dark/60 mt-2">{category.count} agencias</p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="bg-lilac/10 rounded-xl p-12 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">¿Tienes una agencia?</h2>
          <p className="text-lg text-dark/70 mb-6 max-w-2xl mx-auto">
            Únete a nuestro directorio y conecta con clientes que buscan tus servicios.
            Registra tu agencia gratis y accede a funcionalidades premium.
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-primary text-white px-8 py-4 rounded-md font-bold hover:bg-accent hover:text-dark transition"
          >
            Registrar mi Agencia
          </Link>
        </section>
      </div>
    </>
  );
}
