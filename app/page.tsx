import Hero from '@/components/Hero';
import CarouselSponsored from '@/components/CarouselSponsored';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Users, Award, TrendingUp, Megaphone, Code, Camera, FileText, ArrowRight, Search, CheckCircle, Rocket, BarChart3, Heart } from 'lucide-react';
import { serverClient } from '@/app/_trpc/serverClient';
import { expandCategoryToLegacyIds, sumCategoryCounts } from '@/lib/categoryMapping';

export default async function Home() {
  const caller = await serverClient();
  const categoryCounts = await caller.agency.getCategoryCounts();

  const consolidatedCategories = [
    {
      name: 'Performance & Ads',
      icon: TrendingUp,
      description: 'SEO, SEM, publicidad pagada',
      categoryId: 'performance-ads',
    },
    {
      name: 'Social Media',
      icon: Heart,
      description: 'Gestión de redes sociales',
      categoryId: 'social-media',
    },
    {
      name: 'Diseño y Branding',
      icon: Award,
      description: 'Identidad, logos, packaging',
      categoryId: 'branding-identidad',
    },
    {
      name: 'Desarrollo Web',
      icon: Code,
      description: 'Sitios web, e-commerce, apps',
      categoryId: 'desarrollo-web',
    },
    {
      name: 'Producción de Contenido',
      icon: Camera,
      description: 'Audiovisual, copywriting, contenido',
      categoryId: 'produccion-contenido',
    },
    {
      name: 'Relaciones Públicas',
      icon: Users,
      description: 'RRPP, comunicación, eventos',
      categoryId: 'relaciones-publicas',
    },
  ];

  const categories = consolidatedCategories.map(category => ({
    name: category.name,
    icon: category.icon,
    count: sumCategoryCounts(categoryCounts, expandCategoryToLegacyIds(category.categoryId)),
    description: category.description,
    categoryId: category.categoryId,
  }));

  const testimonials = [
    {
      quote: "Gracias a Vitria encontramos la agencia perfecta para lanzar nuestro producto. El proceso fue transparente y los resultados superaron nuestras expectativas.",
      author: "María González",
      role: "CEO & Fundadora en TechStart Chile",
      image: "/stock_images/hispanic_businesswom_bd8902ea.jpg"
    },
    {
      quote: "La plataforma me ayudó a comparar diferentes agencias de marketing digital. Pude ver portfolios, leer reseñas reales y tomar una decisión informada.",
      author: "Carlos Rojas",
      role: "Gerente de Marketing en RestauranteVerde",
      image: "/stock_images/hispanic_businesswom_becfbc99.jpg"
    },
    {
      quote: "Como pequeña empresaria, necesitaba una agencia que entendiera mi presupuesto. En Vitria encontré opciones perfectas para mi negocio.",
      author: "Andrea Silva",
      role: "Propietaria en Boutique Luna",
      image: "/stock_images/hispanic_businesswom_77e4e1e5.jpg"
    }
  ];

  const benefits = [
    {
      value: "100%",
      label: "Gratis para Clientes y Agencias",
      description: "Sin costos ocultos ni comisiones",
      icon: Award,
      color: "text-mint"
    },
    {
      value: "Directo",
      label: "Conexión Inmediata",
      description: "Sin intermediarios, habla con la agencia",
      icon: Rocket,
      color: "text-accent"
    },
    {
      value: "Verificadas",
      label: "Reseñas Reales",
      description: "Opiniones auténticas de clientes",
      icon: Star,
      color: "text-secondary"
    },
    {
      value: "Completo",
      label: "Todo en un Lugar",
      description: "Compara, evalúa y contacta fácil",
      icon: BarChart3,
      color: "text-lilac"
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Busca y Compara",
      description: "Usa filtros avanzados para encontrar agencias que se ajusten a tu industria, presupuesto y ubicación.",
      icon: Search
    },
    {
      step: "2",
      title: "Revisa y Evalúa",
      description: "Examina portfolios, lee reseñas verificadas y compara propuestas de múltiples agencias.",
      icon: CheckCircle
    },
    {
      step: "3",
      title: "Conecta y Crece",
      description: "Contacta directamente con las agencias seleccionadas y empieza a hacer crecer tu marca.",
      icon: Rocket
    }
  ];

  return (
    <>
      <Hero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="mb-20">
          <CarouselSponsored />
        </section>

        <section className="mb-24 bg-gradient-to-br from-mint/10 via-lilac/10 to-secondary/10 rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute top-10 right-10 w-32 h-32 opacity-10">
            <Image src="/vitria-isotipo.png" alt="" fill className="object-contain" />
          </div>
          <div className="absolute bottom-10 left-10 w-24 h-24 opacity-10">
            <Image src="/vitria-isotipo.png" alt="" fill className="object-contain" />
          </div>

          <div className="relative z-10 text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              El Marketplace de Agencias más Grande de Chile
            </h2>
            <p className="text-lg text-dark/70 max-w-2xl mx-auto">
              Conectamos empresas chilenas con las mejores agencias del país
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
                  <Icon className={`w-12 h-12 mx-auto mb-4 ${benefit.color}`} />
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {benefit.value}
                  </div>
                  <div className="text-base font-semibold text-dark mb-2">
                    {benefit.label}
                  </div>
                  <div className="text-sm text-dark/60">
                    {benefit.description}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-24 relative">
          <div className="absolute -top-20 left-1/4 w-20 h-20 opacity-5 hidden lg:block">
            <Image src="/vitria-isotipo.png" alt="" fill className="object-contain" />
          </div>
          <div className="absolute -bottom-20 right-1/4 w-20 h-20 opacity-5 hidden lg:block">
            <Image src="/vitria-isotipo.png" alt="" fill className="object-contain" />
          </div>

          <div className="text-center mb-12 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              ¿Cómo Funciona Vitria?
            </h2>
            <p className="text-lg text-dark/70 max-w-2xl mx-auto">
              Encuentra la agencia perfecta en solo 3 pasos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 relative z-10">
            {howItWorks.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="relative text-center">
                  <div className="mb-6 relative inline-block">
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl">
                      <Icon className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-accent flex items-center justify-center font-bold text-2xl text-dark shadow-lg">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-3">
                    {item.title}
                  </h3>
                  <p className="text-dark/70">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="text-center relative z-10">
            <Link
              href="/agencias"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-dark transition shadow-lg text-lg"
            >
              Empezar Ahora <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.name}
                  href={`/agencias?category=${category.categoryId}`}
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
                <p className="text-dark/80 mb-6 italic leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-mint/30">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-dark">{testimonial.author}</div>
                    <div className="text-sm text-dark/60">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-24 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-12 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-40 h-40 opacity-5">
            <Image src="/vitria-isotipo.png" alt="" fill className="object-contain" />
          </div>
          <div className="absolute bottom-0 right-0 w-40 h-40 opacity-5">
            <Image src="/vitria-isotipo.png" alt="" fill className="object-contain" />
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <Heart className="w-16 h-16 mx-auto mb-6 text-accent" />
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Creamos Comunidad, No Solo Listados
            </h2>
            <div className="space-y-4 text-lg text-dark/80 leading-relaxed">
              <p>
                <strong className="text-primary">A las agencias les cuesta encontrar clientes cualificados. A los clientes les cuesta encontrar agencias confiables.</strong>
              </p>
              <p>
                Creamos esta plataforma para ser ese puente: un espacio donde todas las agencias chilenas —grandes, pequeñas, especializadas o multidisciplinarias— puedan <strong className="text-primary">mostrar su trabajo real y conectar con quienes realmente necesitan sus servicios</strong>.
              </p>
              <p>
                Nuestro objetivo es construir una <strong className="text-primary">comunidad donde todos crecemos juntos</strong>: agencias que encuentran oportunidades, clientes que toman decisiones con información transparente, y un ecosistema más fuerte para todos.
              </p>
              <p className="text-xl font-semibold text-primary pt-4">
                Bienvenido a la comunidad de agencias de Chile 🇨🇱
              </p>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-2xl p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 opacity-10">
              <Image src="/vitria-isotipo.png" alt="" fill className="object-contain" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">¿Tienes una Agencia?</h2>
              <p className="text-lg mb-6 opacity-95">
                Forma parte de nuestra comunidad y haz crecer tu agencia con leads de calidad
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                  <span>Perfil completo y portfolio visible</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                  <span>Reseñas que generan confianza</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                  <span>Métricas para medir tu impacto</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                  <span>Conexión directa con clientes potenciales</span>
                </li>
              </ul>
              <Link
                href="/dashboard"
                className="inline-block bg-accent text-dark px-8 py-4 rounded-lg font-bold hover:bg-white transition shadow-lg"
              >
                Registrar mi Agencia
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-lilac to-mint text-dark rounded-2xl p-10 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/20 rounded-full -ml-32 -mb-32"></div>
            <div className="absolute top-0 right-0 w-40 h-40 opacity-10">
              <Image src="/vitria-isotipo.png" alt="" fill className="object-contain" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4 text-primary">¿Buscas una Agencia?</h2>
              <p className="text-lg mb-6 text-dark/80">
                Descubre agencias especializadas y toma decisiones informadas con datos reales
              </p>
              <ul className="space-y-3 mb-8 text-dark/90">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Explora perfiles completos con portfolios</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Filtra por especialidad y ubicación</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Lee reseñas de otros clientes</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Compara opciones antes de decidir</span>
                </li>
              </ul>
              <Link
                href="/agencias"
                className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-bold hover:bg-dark transition shadow-lg"
              >
                Explorar Agencias
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
