import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const db = createClient(supabaseUrl, supabaseServiceKey);

const REGIONS = ['RM', 'V', 'VIII'];
const CITIES = {
  RM: ['Santiago', 'Providencia', 'Las Condes', 'Vitacura'],
  V: ['Valparaíso', 'Viña del Mar', 'Quilpué'],
  VIII: ['Concepción', 'Talcahuano', 'Chillán'],
};

const SERVICES = [
  'marketing',
  'branding',
  'design',
  'pr',
  'ecommerce',
  'social-media',
  'seo',
  'content',
  'advertising',
];

const AGENCY_NAMES = [
  'Creativa Digital',
  'Brandify Chile',
  'Marketing Pro',
  'Diseño Innovador',
  'Estrategia Total',
  'Comunicación Efectiva',
  'Impulso Creativo',
  'Soluciones Digitales',
  'Visión Estratégica',
  'Talento Creativo',
  'Agencia Moderna',
  'Marketing 360',
  'Branding Studio',
  'Digital First',
  'Creative Lab',
  'Strategy Hub',
  'Media Group',
  'Content Factory',
  'Social Boost',
  'Growth Partners',
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

    console.log('🏢 Insertando 20 agencias...');
    const agencies = [];

    for (let i = 0; i < 20; i++) {
      const region = REGIONS[i % REGIONS.length];
      const cityOptions = CITIES[region as keyof typeof CITIES];
      const city = cityOptions[Math.floor(Math.random() * cityOptions.length)];
      const isPremium = i < 5;

      const servicesCount = 3 + Math.floor(Math.random() * 4);
      const selectedServices = SERVICES.sort(() => 0.5 - Math.random()).slice(0, servicesCount);

      const agency = {
        owner_id: user?.id || null,
        name: AGENCY_NAMES[i],
        slug: AGENCY_NAMES[i].toLowerCase().replace(/\s+/g, '-'),
        logo_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(AGENCY_NAMES[i])}&background=1B5568&color=fff&size=200`,
        cover_url: null,
        description: `${AGENCY_NAMES[i]} es una agencia especializada en ${selectedServices.join(', ')}. Con años de experiencia en el mercado chileno, ofrecemos soluciones creativas e innovadoras para impulsar tu marca.`,
        website: `https://${AGENCY_NAMES[i].toLowerCase().replace(/\s+/g, '')}.cl`,
        email: `contacto@${AGENCY_NAMES[i].toLowerCase().replace(/\s+/g, '')}.cl`,
        phone: `+56 9 ${8000 + i}${1000 + i}${100 + i}`,
        location_city: city,
        location_region: region,
        employees_min: 5 + i * 2,
        employees_max: 15 + i * 3,
        price_range: ['$', '$$', '$$$'][i % 3],
        services: selectedServices,
        categories: selectedServices.slice(0, 2),
        is_verified: i < 10,
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
    console.log(`   - 20 agencias (5 Premium)`);
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
