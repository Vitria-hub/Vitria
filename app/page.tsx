import HeroEnhanced from '@/components/HeroEnhanced';
import CarouselSponsored from '@/components/CarouselSponsored';
import SectionWrapper from '@/components/SectionWrapper';
import SectionHeader from '@/components/SectionHeader';
import CategoryCarousel from '@/components/CategoryCarousel';
import FeaturedAgencyCard from '@/components/FeaturedAgencyCard';
import TestimonialsEnhanced from '@/components/TestimonialsEnhanced';
import Link from 'next/link';
import LoadingLink from '@/components/LoadingLink';
import Image from 'next/image';
import { Star, Users, Award, TrendingUp, Megaphone, Code, Camera, ArrowRight, Search, CheckCircle, Rocket, BarChart3, Heart, Zap } from 'lucide-react';
import { serverClient } from '@/app/_trpc/serverClient';

export default async function Home() {
  const caller = await serverClient();
  const categoryCounts = await caller.agency.getCategoryCounts();
  
  let featuredAgencies: any[] = [];
  try {
    const result = await caller.agency.list({ 
      page: 1, 
      limit: 6, 
      sort: 'premium' 
    });
    featuredAgencies = result.agencies || [];
  } catch (e) {
    console.error('Error fetching featured agencies:', e);
  }

  const consolidatedCategories = [
    {
      name: 'Performance & Ads',
      description: 'SEO, SEM, publicidad pagada y campañas de conversión',
      categoryId: 'performance-ads',
    },
    {
      name: 'Social Media',
      description: 'Gestión de redes sociales y community management',
      categoryId: 'social-media',
    },
    {
      name: 'Diseño y Branding',
      description: 'Identidad de marca, logos y packaging creativo',
      categoryId: 'branding-identidad',
    },
    {
      name: 'Desarrollo Web',
      description: 'Sitios web, e-commerce y aplicaciones móviles',
      categoryId: 'desarrollo-web',
    },
    {
      name: 'Producción de Contenido',
      description: 'Audiovisual, fotografía y copywriting profesional',
      categoryId: 'produccion-contenido',
    },
    {
      name: 'Relaciones Públicas',
      description: 'RRPP, comunicación corporativa y eventos',
      categoryId: 'relaciones-publicas',
    },
  ];

  const categories = consolidatedCategories.map(category => ({
    name: category.name,
    count: categoryCounts[category.categoryId] || 0,
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
      image: "/stock_images/professional_hispani_520e81e1.jpg"
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
      label: "Gratis",
      description: "Sin costos ocultos ni comisiones",
      icon: Award,
      color: "text-mint"
    },
    {
      value: "Directo",
      label: "Conexión",
      description: "Sin intermediarios, habla con la agencia",
      icon: Rocket,
      color: "text-accent"
    },
    {
      value: "Reales",
      label: "Reseñas",
      description: "Opiniones auténticas de clientes",
      icon: Star,
      color: "text-secondary"
    },
    {
      value: "Simple",
      label: "Proceso",
      description: "Compara, evalúa y contacta fácil",
      icon: BarChart3,
      color: "text-lilac"
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Busca",
      description: "Usa filtros avanzados para encontrar agencias que se ajusten a tu industria y presupuesto.",
      icon: Search
    },
    {
      step: "2",
      title: "Evalúa",
      description: "Examina portfolios, lee reseñas verificadas y compara propuestas.",
      icon: CheckCircle
    },
    {
      step: "3",
      title: "Conecta",
      description: "Contacta directamente con las agencias y empieza a crecer.",
      icon: Rocket
    }
  ];

  return (
    <>
      <HeroEnhanced />

      <SectionWrapper bgVariant="white" className="py-12 md:py-16">
        <CarouselSponsored />
      </SectionWrapper>

      <SectionWrapper bgVariant="gradient" showDecor decorPosition="both">
        <SectionHeader
          eyebrow="¿Por qué Vitria?"
          icon={Zap}
          title="El Marketplace de Agencias más Grande de Chile"
          subtitle="Conectamos empresas chilenas con las mejores agencias del país"
        />
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="text-center bg-white rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition">
                <Icon className={`w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 ${benefit.color}`} />
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                  {benefit.value}
                </div>
                <div className="text-sm md:text-base font-semibold text-dark mb-1">
                  {benefit.label}
                </div>
                <div className="text-xs md:text-sm text-dark/60">
                  {benefit.description}
                </div>
              </div>
            );
          })}
        </div>
      </SectionWrapper>

      <SectionWrapper bgVariant="white" showDecor decorPosition="top-right">
        <SectionHeader
          title="¿Cómo Funciona?"
          subtitle="Encuentra la agencia perfecta en solo 3 pasos"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-10">
          {howItWorks.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="relative text-center">
                <div className="mb-4 md:mb-6 relative inline-block">
                  <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl">
                    <Icon className="w-10 h-10 md:w-12 md:h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent flex items-center justify-center font-bold text-lg md:text-2xl text-dark shadow-lg">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base text-dark/70">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <LoadingLink
            href="/agencias"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold hover:bg-dark transition shadow-lg text-base md:text-lg"
          >
            Empezar Ahora <ArrowRight className="w-5 h-5" />
          </LoadingLink>
        </div>
      </SectionWrapper>

      <SectionWrapper bgVariant="light">
        <SectionHeader
          eyebrow="Especialidades"
          icon={Megaphone}
          title="Explora por Categoría"
          subtitle="Encuentra agencias especializadas en tu industria y necesidades"
        />
        
        <CategoryCarousel categories={categories} />
        
        <div className="text-center mt-8">
          <Link 
            href="/agencias" 
            className="inline-flex items-center gap-2 text-primary font-semibold hover:text-secondary transition text-base"
          >
            Ver todas las agencias <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </SectionWrapper>

      {featuredAgencies.length > 0 && (
        <SectionWrapper bgVariant="white" showDecor decorPosition="bottom-left">
          <SectionHeader
            eyebrow="Destacadas"
            icon={Star}
            title="Agencias Recomendadas"
            subtitle="Conoce las agencias mejor valoradas por la comunidad"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
            {featuredAgencies.slice(0, 6).map((agency) => (
              <FeaturedAgencyCard key={agency.id} agency={agency} />
            ))}
          </div>

          <div className="text-center">
            <LoadingLink
              href="/agencias"
              className="inline-flex items-center gap-2 bg-accent text-dark px-6 py-3 rounded-xl font-bold hover:bg-accent/90 transition shadow-md"
            >
              Ver todas las agencias <ArrowRight className="w-4 h-4" />
            </LoadingLink>
          </div>
        </SectionWrapper>
      )}

      <SectionWrapper bgVariant="accent" showDecor decorPosition="top-left">
        <SectionHeader
          eyebrow="Testimonios"
          icon={Star}
          title="Lo que Dicen Nuestros Usuarios"
          subtitle="Historias reales de empresarios chilenos que encontraron el socio digital ideal"
        />
        
        <TestimonialsEnhanced testimonials={testimonials} />
      </SectionWrapper>

      <SectionWrapper bgVariant="primary" showDecor decorPosition="both">
        <div className="max-w-4xl mx-auto text-center">
          <Heart className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 text-accent" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4 md:mb-6">
            Creamos Comunidad, No Solo Listados
          </h2>
          <div className="space-y-4 text-base md:text-lg text-dark/80 leading-relaxed">
            <p>
              <strong className="text-primary">A las agencias les cuesta encontrar clientes cualificados. A los clientes les cuesta encontrar agencias confiables.</strong>
            </p>
            <p>
              Creamos esta plataforma para ser ese puente: un espacio donde todas las agencias chilenas puedan <strong className="text-primary">mostrar su trabajo real y conectar con quienes necesitan sus servicios</strong>.
            </p>
            <p className="text-lg md:text-xl font-semibold text-primary pt-2">
              Bienvenido a la comunidad de agencias de Chile 🇨🇱
            </p>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper bgVariant="white" className="py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-2xl p-6 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-white/10 rounded-full -mr-24 md:-mr-32 -mt-24 md:-mt-32"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 md:w-40 md:h-40 opacity-10">
              <Image src="/vitria-isotipo.png" alt="" fill sizes="128px" className="object-contain" />
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">¿Tienes una Agencia?</h2>
              <p className="text-base md:text-lg mb-4 md:mb-6 opacity-95">
                Forma parte de nuestra comunidad y haz crecer tu agencia
              </p>
              <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8 text-sm md:text-base">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0"></div>
                  <span>Perfil completo y portfolio visible</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0"></div>
                  <span>Reseñas que generan confianza</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0"></div>
                  <span>Conexión directa con clientes</span>
                </li>
              </ul>
              <Link
                href="/dashboard"
                className="inline-block bg-accent text-dark px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold hover:bg-white transition shadow-lg text-sm md:text-base min-h-[48px]"
              >
                Registrar mi Agencia
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-lilac to-mint text-dark rounded-2xl p-6 md:p-10 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-white/20 rounded-full -ml-24 md:-ml-32 -mb-24 md:-mb-32"></div>
            <div className="absolute top-0 right-0 w-32 h-32 md:w-40 md:h-40 opacity-10">
              <Image src="/vitria-isotipo.png" alt="" fill sizes="128px" className="object-contain" />
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-primary">¿Buscas una Agencia?</h2>
              <p className="text-base md:text-lg mb-4 md:mb-6 text-dark/80">
                Descubre agencias especializadas con datos reales
              </p>
              <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8 text-dark/90 text-sm md:text-base">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                  <span>Explora perfiles con portfolios</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                  <span>Filtra por especialidad y ubicación</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                  <span>Lee reseñas de otros clientes</span>
                </li>
              </ul>
              <LoadingLink
                href="/agencias"
                className="inline-block bg-primary text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold hover:bg-dark transition shadow-lg text-sm md:text-base min-h-[48px]"
              >
                Explorar Agencias
              </LoadingLink>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
