import { supabaseAdmin } from '../lib/supabase-admin';

async function seedAnalyticsData() {
  console.log('🌱 Iniciando seed de datos de prueba...');

  // 1. Crear usuarios de prueba
  console.log('📝 Creando usuarios...');
  
  const testUsers = [
    {
      id: crypto.randomUUID(),
      auth_id: crypto.randomUUID(),
      full_name: 'Admin Usuario',
      role: 'admin',
    },
    {
      id: crypto.randomUUID(),
      auth_id: crypto.randomUUID(),
      full_name: 'María González',
      role: 'agency',
    },
    {
      id: crypto.randomUUID(),
      auth_id: crypto.randomUUID(),
      full_name: 'Pedro Martínez',
      role: 'agency',
    },
    {
      id: crypto.randomUUID(),
      auth_id: crypto.randomUUID(),
      full_name: 'Ana Silva',
      role: 'user',
    },
  ];

  const { error: usersError } = await supabaseAdmin
    .from('users')
    .insert(testUsers);

  if (usersError) {
    console.error('❌ Error creando usuarios:', usersError);
    return;
  }

  console.log('✅ Usuarios creados');

  // 2. Crear agencias
  console.log('🏢 Creando agencias...');

  const agencies = [
    {
      id: crypto.randomUUID(),
      owner_id: testUsers[1].id,
      name: 'CreativeLab Chile',
      slug: 'creativelab-chile',
      description: 'Agencia de marketing digital especializada en branding y estrategia de contenido',
      website: 'https://creativelab.cl',
      email: 'contacto@creativelab.cl',
      phone: '+56912345678',
      location_city: 'Santiago',
      location_region: 'Región Metropolitana',
      services: ['Branding', 'Marketing Digital', 'Redes Sociales'],
      categories: ['Marketing', 'Branding'],
      avg_rating: 4.5,
      reviews_count: 12,
      is_premium: true,
      is_verified: true,
    },
    {
      id: crypto.randomUUID(),
      owner_id: testUsers[2].id,
      name: 'DesignHub',
      slug: 'designhub',
      description: 'Estudio de diseño gráfico y web con más de 10 años de experiencia',
      website: 'https://designhub.cl',
      email: 'hola@designhub.cl',
      phone: '+56987654321',
      location_city: 'Valparaíso',
      location_region: 'Valparaíso',
      services: ['Diseño Gráfico', 'Diseño Web', 'UX/UI'],
      categories: ['Diseño', 'Tecnología'],
      avg_rating: 4.8,
      reviews_count: 24,
      is_premium: false,
      is_verified: true,
    },
    {
      id: crypto.randomUUID(),
      owner_id: testUsers[1].id,
      name: 'Estrategia Plus',
      slug: 'estrategia-plus',
      description: 'Consultoría estratégica y gestión de proyectos digitales',
      website: 'https://estrategiaplus.cl',
      email: 'info@estrategiaplus.cl',
      phone: '+56923456789',
      location_city: 'Concepción',
      location_region: 'Biobío',
      services: ['Consultoría', 'Estrategia Digital', 'SEO'],
      categories: ['Consultoría', 'Marketing'],
      avg_rating: 4.2,
      reviews_count: 8,
      is_premium: true,
      is_verified: false,
    },
  ];

  const { error: agenciesError } = await supabaseAdmin
    .from('agencies')
    .insert(agencies);

  if (agenciesError) {
    console.error('❌ Error creando agencias:', agenciesError);
    return;
  }

  console.log('✅ Agencias creadas');

  // 3. Crear datos de analytics (últimos 30 días)
  console.log('📊 Creando datos de analytics...');

  const now = new Date();
  const interactionLogs: any[] = [];
  const searchAnalytics: any[] = [];

  // Generar datos para los últimos 30 días
  for (let day = 0; day < 30; day++) {
    const date = new Date(now);
    date.setDate(date.getDate() - day);

    // Vistas por día (10-50 por agencia)
    agencies.forEach((agency) => {
      const viewsCount = Math.floor(Math.random() * 40) + 10;
      for (let i = 0; i < viewsCount; i++) {
        interactionLogs.push({
          agency_id: agency.id,
          interaction_type: 'view',
          session_id: crypto.randomUUID(),
          created_at: date.toISOString(),
        });
      }

      // Contacts por día (2-10 por agencia)
      const contactTypes = ['phone_click', 'email_click', 'website_click', 'form_submit'];
      const contactsCount = Math.floor(Math.random() * 8) + 2;
      for (let i = 0; i < contactsCount; i++) {
        interactionLogs.push({
          agency_id: agency.id,
          interaction_type: contactTypes[Math.floor(Math.random() * contactTypes.length)],
          session_id: crypto.randomUUID(),
          created_at: date.toISOString(),
        });
      }
    });

    // Búsquedas por día (20-40)
    const searchesCount = Math.floor(Math.random() * 20) + 20;
    const queries = ['marketing', 'diseño', 'branding', 'publicidad', 'digital'];
    const categories = ['Branding', 'Marketing Digital', 'Diseño Gráfico', 'SEO'];

    for (let i = 0; i < searchesCount; i++) {
      const useQuery = Math.random() > 0.3;
      searchAnalytics.push({
        search_query: useQuery ? queries[Math.floor(Math.random() * queries.length)] : null,
        service_category: !useQuery || Math.random() > 0.5 
          ? categories[Math.floor(Math.random() * categories.length)] 
          : null,
        results_count: Math.floor(Math.random() * 3) + 1,
        agencies_shown: agencies.slice(0, Math.floor(Math.random() * 3) + 1).map(a => a.id),
        clicked_agency_id: Math.random() > 0.3 ? agencies[Math.floor(Math.random() * agencies.length)].id : null,
        clicked_position: Math.random() > 0.3 ? Math.floor(Math.random() * 3) : null,
        session_id: crypto.randomUUID(),
        created_at: date.toISOString(),
      });
    }
  }

  // Insertar en lotes
  const batchSize = 100;
  
  for (let i = 0; i < interactionLogs.length; i += batchSize) {
    const batch = interactionLogs.slice(i, i + batchSize);
    const { error } = await supabaseAdmin
      .from('interaction_logs')
      .insert(batch);
    if (error) {
      console.error('❌ Error insertando interaction_logs:', error);
      return;
    }
  }

  for (let i = 0; i < searchAnalytics.length; i += batchSize) {
    const batch = searchAnalytics.slice(i, i + batchSize);
    const { error } = await supabaseAdmin
      .from('search_analytics')
      .insert(batch);
    if (error) {
      console.error('❌ Error insertando search_analytics:', error);
      return;
    }
  }

  console.log('✅ Datos de analytics creados');
  console.log(`📈 Total de interaction_logs: ${interactionLogs.length}`);
  console.log(`🔍 Total de search_analytics: ${searchAnalytics.length}`);

  // Mostrar credenciales
  console.log('\n🔑 Usuarios de prueba creados:');
  console.log('Admin: contacto@vitria.cl / Vitria2026 (usar credenciales de Supabase Auth)');
  console.log(`\nAgencia 1: ${testUsers[1].full_name} (ID: ${testUsers[1].id})`);
  console.log(`Agencia 2: ${testUsers[2].full_name} (ID: ${testUsers[2].id})`);
  
  console.log('\n✨ ¡Seed completado exitosamente!');
}

seedAnalyticsData().catch(console.error);
