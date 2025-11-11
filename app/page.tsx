import Hero from '@/components/Hero';
import CarouselSponsored from '@/components/CarouselSponsored';
import Link from 'next/link';
import { Star, Users, Award, TrendingUp, Megaphone, Code, Camera, FileText, ArrowRight } from 'lucide-react';

export default function Home() {
  const categories = [
    { 
      name: 'Marketing Digital', 
      icon: TrendingUp, 
      count: 45,
      description: 'SEO, SEM, redes sociales'
    },
    { 
      name: 'Publicidad', 
      icon: Megaphone, 
      count: 38,
      description: 'Campañas, medios, estrategia'
    },
    { 
      name: 'Diseño y Branding', 
      icon: Award, 
      count: 52,
      description: 'Identidad, logos, packaging'
    },
    { 
      name: 'Contenido', 
      icon: FileText, 
      count: 28,
      description: 'Copywriting, blogs, scripts'
    },
    { 
      name: 'Audiovisual', 
      icon: Camera, 
      count: 31,
      description: 'Video, fotografía, producción'
    },
    { 
      name: 'Desarrollo Web', 
      icon: Code, 
      count: 42,
      description: 'Sitios web, e-commerce, apps'
    },
    { 
      name: 'Relaciones Públicas', 
      icon: Users, 
      count: 22,
      description: 'RRPP, comunicación, eventos'
    },
    { 
      name: 'Social Media', 
      icon: Star, 
      count: 35,
      description: 'Community, influencers, gestión'
    },
  ];

  const testimonials = [
    {
      quote: "Gracias a Vitria encontramos la agencia perfecta para lanzar nuestro producto. El proceso fue transparente y los resultados superaron nuestras expectativas.",
      author: "María González",
      role: "CEO & Fundadora en TechStart Chile",
      initials: "MG"
    },
    {
      quote: "La plataforma me ayudó a comparar diferentes agencias de marketing digital. Pude ver portfolios, leer reseñas reales y tomar una decisión informada.",
      author: "Carlos Rojas",
      role: "Gerente de Marketing en RestauranteVerde",
      initials: "CR"
    },
    {
      quote: "Como pequeña empresaria, necesitaba una agencia que entendiera mi presupuesto. En Vitria encontré opciones perfectas para mi negocio.",
      author: "Andrea Silva",
      role: "Propietaria en Boutique Luna",
      initials: "AS"
    }
  ];

  return (
    <>
      <Hero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="mb-20">
          <CarouselSponsored />
        </section>

        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Explora por Especialidad
            </h2>
            <p className="text-lg text-dark/70 max-w-2xl mx-auto">
              Encuentra agencias especializadas en tu industria y necesidades específicas
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.name}
                  href="/agencias"
                  className="group bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-mint/20 rounded-lg group-hover:bg-primary/10 transition">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-dark mb-1 group-hover:text-primary transition">
                        {category.name}
                      </h3>
                      <p className="text-sm text-dark/60 mb-2">{category.description}</p>
                      <p className="text-xs font-semibold text-primary">{category.count} agencias</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center">
            <Link 
              href="/agencias" 
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-secondary transition"
            >
              Ver todas las categorías <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Lo que Dicen Nuestros Usuarios
            </h2>
            <p className="text-lg text-dark/70 max-w-2xl mx-auto">
              Historias reales de empresarios chilenos que encontraron el socio digital ideal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:shadow-lg transition">
                <p className="text-dark/80 mb-6 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-dark">{testimonial.author}</div>
                    <div className="text-sm text-dark/60">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-2xl p-10 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">¿Tienes una Agencia?</h2>
              <p className="text-lg mb-6 opacity-95">
                Únete a la comunidad de agencias más grande de Chile y conecta con nuevos clientes
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                  <span>Perfil profesional gratuito</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                  <span>Gestión de reseñas y portfolio</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                  <span>Dashboard con métricas detalladas</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                  <span>Leads cualificados mensualmente</span>
                </li>
              </ul>
              <Link
                href="/dashboard"
                className="inline-block bg-accent text-dark px-8 py-4 rounded-lg font-bold hover:bg-white transition shadow-lg"
              >
                Registrar mi Agencia
              </Link>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          </div>

          <div className="bg-gradient-to-br from-lilac to-mint text-dark rounded-2xl p-10 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4 text-primary">¿Buscas una Agencia?</h2>
              <p className="text-lg mb-6 text-dark/80">
                Encuentra la agencia perfecta para hacer crecer tu negocio con confianza
              </p>
              <ul className="space-y-3 mb-8 text-dark/90">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Acceso gratuito a todos los perfiles</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Filtros avanzados por especialidad</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Reseñas verificadas de clientes reales</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Comparación directa entre agencias</span>
                </li>
              </ul>
              <Link
                href="/agencias"
                className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-dark transition shadow-lg"
              >
                Explorar Agencias
              </Link>
            </div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/20 rounded-full -ml-32 -mb-32"></div>
          </div>
        </section>
      </div>
    </>
  );
}
