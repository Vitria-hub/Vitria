import Hero from '@/components/Hero';
import CarouselSponsored from '@/components/CarouselSponsored';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Users, Award, TrendingUp, Megaphone, Code, Camera, FileText, ArrowRight, Search, CheckCircle, Rocket, BarChart3 } from 'lucide-react';

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

  const stats = [
    {
      value: "500+",
      label: "Agencias Verificadas",
      icon: Award,
      color: "text-mint"
    },
    {
      value: "10,000+",
      label: "Proyectos Completados",
      icon: Rocket,
      color: "text-accent"
    },
    {
      value: "95%",
      label: "Satisfacción de Clientes",
      icon: Star,
      color: "text-secondary"
    },
    {
      value: "4.8/5",
      label: "Calificación Promedio",
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

        <section className="mb-24 bg-gradient-to-br from-mint/10 via-lilac/10 to-secondary/10 rounded-3xl p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              El Marketplace de Agencias más Grande de Chile
            </h2>
            <p className="text-lg text-dark/70 max-w-2xl mx-auto">
              Conectamos empresas chilenas con las mejores agencias del país
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
                  <Icon className={`w-12 h-12 mx-auto mb-4 ${stat.color}`} />
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-dark/70">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              ¿Cómo Funciona Vitria?
            </h2>
            <p className="text-lg text-dark/70 max-w-2xl mx-auto">
              Encuentra la agencia perfecta en solo 3 pasos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
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

          <div className="text-center">
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
