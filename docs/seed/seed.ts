import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan variables de entorno de Supabase');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('SUPABASE_SERVICE_ROLE:', supabaseServiceKey ? '✅' : '❌');
  process.exit(1);
}

const db = createClient(supabaseUrl, supabaseServiceKey);

const REGIONS = ['RM', 'V', 'VIII'];
const CITIES = {
  RM: ['Santiago', 'Providencia', 'Las Condes', 'Vitacura'],
  V: ['Valparaíso', 'Viña del Mar', 'Quilpué'],
  VIII: ['Concepción', 'Talcahuano', 'Chillán'],
};

const CATEGORIES = [
  'Marketing Digital',
  'Publicidad',
  'Diseño y Branding',
  'Contenido',
  'Audiovisual',
  'Desarrollo Web',
  'Relaciones Públicas',
  'Social Media',
];

const AGENCIES_DATA = [
  { name: 'Creativa Digital', category: 'Marketing Digital', services: ['SEO', 'SEM', 'Marketing Digital'], description: 'Especialistas en posicionamiento web y campañas digitales con 10 años de experiencia en Chile.' },
  { name: 'Brandify Studio', category: 'Diseño y Branding', services: ['Branding', 'Diseño Gráfico', 'Identidad Corporativa'], description: 'Creamos marcas memorables que conectan con tu audiencia. Diseño estratégico y creativo.' },
  { name: 'Marketing 360', category: 'Marketing Digital', services: ['Marketing Digital', 'Social Media', 'Content Marketing'], description: 'Soluciones integrales de marketing digital para empresas B2B y B2C en Chile.' },
  { name: 'Publicidad Impacto', category: 'Publicidad', services: ['Publicidad', 'Campañas ATL', 'Estrategia de Medios'], description: 'Agencia creativa enfocada en campañas publicitarias que generan resultados medibles.' },
  { name: 'Contenido Pro', category: 'Contenido', services: ['Copywriting', 'Content Marketing', 'Blogs'], description: 'Creamos contenido que vende. Especialistas en storytelling y marketing de contenidos.' },
  { name: 'VideoPro Chile', category: 'Audiovisual', services: ['Producción Audiovisual', 'Fotografía', 'Video Corporativo'], description: 'Producción audiovisual profesional para marcas que quieren destacar.' },
  { name: 'WebDev Solutions', category: 'Desarrollo Web', services: ['Desarrollo Web', 'E-commerce', 'Apps Móviles'], description: 'Desarrollamos sitios web y aplicaciones que impulsan tu negocio digital.' },
  { name: 'Social Boost', category: 'Social Media', services: ['Gestión RRSS', 'Community Management', 'Influencers'], description: 'Hacemos crecer tu comunidad en redes sociales con estrategias basadas en datos.' },
  { name: 'Estrategia Total', category: 'Publicidad', services: ['Estrategia Publicitaria', 'Planificación de Medios', 'BTL'], description: 'Planificación estratégica y ejecución de campañas 360 para grandes marcas.' },
  { name: 'Diseño Innovador', category: 'Diseño y Branding', services: ['Diseño UX/UI', 'Branding', 'Packaging'], description: 'Diseño centrado en el usuario que mejora la experiencia y genera conversiones.' },
  { name: 'SEO Masters', category: 'Marketing Digital', services: ['SEO', 'SEA', 'Analytics'], description: 'Posicionamiento web que realmente funciona. Expertos certificados en Google.' },
  { name: 'Creative Lab', category: 'Publicidad', services: ['Creatividad Publicitaria', 'Campañas Digitales', 'Branding'], description: 'Laboratorio creativo donde nacen las mejores ideas para tu marca.' },
  { name: 'Media Group Chile', category: 'Relaciones Públicas', services: ['RRPP', 'Comunicación Corporativa', 'Eventos'], description: 'Gestión de comunicación estratégica y relaciones públicas para empresas líderes.' },
  { name: 'Digital First', category: 'Marketing Digital', services: ['Marketing Digital', 'Performance Marketing', 'Growth Hacking'], description: 'Aceleramos el crecimiento de tu negocio con estrategias de marketing basadas en datos.' },
  { name: 'Content Factory', category: 'Contenido', services: ['Producción de Contenido', 'SEO Content', 'Scripts'], description: 'Fábrica de contenido de alto valor para marcas que buscan autoridad en su nicho.' },
  { name: 'Branding House', category: 'Diseño y Branding', services: ['Identidad de Marca', 'Naming', 'Brand Strategy'], description: 'Construimos marcas sólidas desde la estrategia hasta la ejecución visual.' },
  { name: 'Social Media Lab', category: 'Social Media', services: ['Social Media Strategy', 'Contenido RRSS', 'Publicidad Social'], description: 'Especialistas en crear engagement y comunidades activas en todas las plataformas.' },
  { name: 'Visual Studio', category: 'Audiovisual', services: ['Fotografía Comercial', 'Video Marketing', 'Motion Graphics'], description: 'Contamos historias visuales que cautivan y convierten espectadores en clientes.' },
  { name: 'Tech Web Agency', category: 'Desarrollo Web', services: ['Desarrollo Web', 'Shopify', 'WordPress'], description: 'Creamos tiendas online y sitios web que venden 24/7.' },
  { name: 'Growth Partners', category: 'Marketing Digital', services: ['Growth Marketing', 'CRO', 'Email Marketing'], description: 'Socios estratégicos enfocados en el crecimiento sostenible de tu negocio.' },
  { name: 'PR Comunicaciones', category: 'Relaciones Públicas', services: ['Gestión de Crisis', 'Media Relations', 'Corporate Communications'], description: 'Protegemos y potenciamos la reputación de tu marca en medios y opinión pública.' },
  { name: 'Creativo Studio', category: 'Publicidad', services: ['Campañas Creativas', 'Publicidad Digital', 'Estrategia Creativa'], description: 'Ideas creativas que se convierten en campañas exitosas y memorables.' },
  { name: 'E-commerce Pro', category: 'Desarrollo Web', services: ['E-commerce', 'Integración de Pagos', 'Optimización de Conversión'], description: 'Expertos en comercio electrónico. Creamos tiendas que venden y escalan.' },
  { name: 'Film Production', category: 'Audiovisual', services: ['Producción Cinematográfica', 'Comerciales TV', 'Documentales'], description: 'Producción audiovisual de alto nivel para cine, TV y plataformas digitales.' },
  { name: 'Copy Masters', category: 'Contenido', services: ['Copywriting Estratégico', 'UX Writing', 'Email Copy'], description: 'Palabras que venden. Especialistas en copy persuasivo que convierte.' },
  { name: 'Influencer Hub', category: 'Social Media', services: ['Marketing de Influencers', 'Gestión de Campañas', 'Talent Management'], description: 'Conectamos marcas con influencers para campañas auténticas y efectivas.' },
  { name: 'UX Design Lab', category: 'Diseño y Branding', services: ['Diseño UX', 'Research', 'Prototipado'], description: 'Diseñamos experiencias digitales centradas en las necesidades de tus usuarios.' },
  { name: 'Event Masters', category: 'Relaciones Públicas', services: ['Eventos Corporativos', 'Lanzamientos', 'Activaciones de Marca'], description: 'Creamos eventos memorables que conectan tu marca con tu audiencia.' },
  { name: 'Performance Ads', category: 'Marketing Digital', services: ['Google Ads', 'Facebook Ads', 'Performance Marketing'], description: 'Especialistas en publicidad digital con foco en ROI y resultados medibles.' },
  { name: 'Full Stack Digital', category: 'Desarrollo Web', services: ['Desarrollo Full Stack', 'Apps Web', 'API Development'], description: 'Soluciones web completas desde el backend hasta la interfaz de usuario.' },
];

async function seed() {
  console.log('🌱 Iniciando seed de datos...');

  try {
    console.log('📋 Insertando planes...');
    await db.from('plans').upsert([
      {
        id: 'free',
        name: 'Plan Free',
        price_month_cents: 0,
        benefits: ['Perfil básico', 'Hasta 3 imágenes de portafolio', 'Reseñas de clientes'],
      },
      {
        id: 'premium',
        name: 'Plan Premium',
        price_month_cents: 4900,
        benefits: [
          'Perfil destacado',
          'Badge Premium',
          'Portafolio ilimitado',
          'Métricas avanzadas',
          'Prioridad en búsquedas',
          'Slots patrocinados',
        ],
      },
    ]);

    console.log('👥 Insertando usuario de prueba...');
    const { data: user } = await db
      .from('users')
      .insert({
        auth_id: '00000000-0000-0000-0000-000000000001',
        full_name: 'Usuario Demo',
        role: 'agency',
      })
      .select()
      .single();

    console.log('🏢 Insertando 30 agencias...');
    const agencies = [];

    for (let i = 0; i < AGENCIES_DATA.length; i++) {
      const agencyData = AGENCIES_DATA[i];
      const region = REGIONS[i % REGIONS.length];
      const cityOptions = CITIES[region as keyof typeof CITIES];
      const city = cityOptions[Math.floor(Math.random() * cityOptions.length)];
      const isPremium = i < 8;

      const agency = {
        owner_id: user?.id || null,
        name: agencyData.name,
        slug: agencyData.name.toLowerCase().replace(/\s+/g, '-'),
        logo_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(agencyData.name)}&background=1B5568&color=fff&size=200`,
        cover_url: null,
        description: agencyData.description,
        website: `https://${agencyData.name.toLowerCase().replace(/\s+/g, '')}.cl`,
        email: `contacto@${agencyData.name.toLowerCase().replace(/\s+/g, '')}.cl`,
        phone: `+56 9 ${8000 + i * 11}${1000 + i * 7}`,
        location_city: city,
        location_region: region,
        employees_min: 5 + (i % 5) * 3,
        employees_max: 15 + (i % 5) * 8,
        price_range: ['Menos de 1M', '1-3M', '3-5M', '5M+'][i % 4],
        services: agencyData.services,
        categories: [agencyData.category],
        is_verified: i < 20,
        is_premium: isPremium,
        premium_until: isPremium ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null,
      };

      const { data } = await db.from('agencies').insert(agency).select().single();
      if (data) agencies.push(data);
    }

    console.log(`✅ ${agencies.length} agencias creadas`);

    console.log('⭐ Insertando reseñas...');
    let reviewCount = 0;

    for (const agency of agencies) {
      const numReviews = 3 + Math.floor(Math.random() * 3);

      for (let i = 0; i < numReviews; i++) {
        await db.from('reviews').insert({
          agency_id: agency.id,
          user_id: user?.id || null,
          rating: 3 + Math.floor(Math.random() * 3),
          comment:
            i % 2 === 0
              ? `Excelente servicio, muy profesionales y creativos. Recomendados 100%.`
              : `Muy buena experiencia trabajando con ellos. Cumplieron con los plazos establecidos.`,
          status: 'approved',
        });
        reviewCount++;
      }
    }

    console.log(`✅ ${reviewCount} reseñas creadas`);

    console.log('🖼️ Insertando portafolio para agencias Premium...');
    let portfolioCount = 0;

    for (const agency of agencies.filter((a) => a.is_premium)) {
      for (let i = 0; i < 3; i++) {
        await db.from('portfolio_items').insert({
          agency_id: agency.id,
          title: `Proyecto ${['Creativo', 'Estratégico', 'Innovador'][i]}`,
          description: `Campaña integral de marketing digital para cliente destacado.`,
          media_urls: [`https://picsum.photos/seed/${agency.id}-${i}/800/600`],
          client_name: `Cliente ${i + 1}`,
          tags: agency.services.slice(0, 2),
        });
        portfolioCount++;
      }
    }

    console.log(`✅ ${portfolioCount} elementos de portafolio creados`);

    console.log('🎯 Insertando slots patrocinados...');
    const now = new Date();
    const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    let sponsorCount = 0;
    for (let i = 0; i < Math.min(5, agencies.length); i++) {
      if (agencies[i].is_premium) {
        await db.from('sponsored_slots').insert({
          agency_id: agencies[i].id,
          position: i + 1,
          starts_at: now.toISOString(),
          ends_at: futureDate.toISOString(),
        });
        sponsorCount++;
      }
    }

    console.log(`✅ ${sponsorCount} slots patrocinados creados`);

    console.log('📊 Insertando métricas de ejemplo...');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    let metricsCount = 0;
    for (const agency of agencies.slice(0, 10)) {
      await db.from('agency_metrics_daily').insert({
        day: yesterday.toISOString().split('T')[0],
        agency_id: agency.id,
        views: Math.floor(Math.random() * 100) + 50,
        profile_clicks: Math.floor(Math.random() * 50) + 10,
        contact_clicks: Math.floor(Math.random() * 20) + 5,
        leads: Math.floor(Math.random() * 10) + 1,
      });
      metricsCount++;
    }

    console.log(`✅ ${metricsCount} registros de métricas creados`);

    console.log('');
    console.log('✨ ¡Seed completado exitosamente!');
    console.log(`📊 Resumen:`);
    console.log(`   - 30 agencias (8 Premium)`);
    console.log(`   - ${reviewCount} reseñas`);
    console.log(`   - ${portfolioCount} elementos de portafolio`);
    console.log(`   - ${sponsorCount} slots patrocinados`);
    console.log(`   - ${metricsCount} métricas diarias`);
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  }
}

seed()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
