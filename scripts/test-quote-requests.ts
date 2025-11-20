import { supabaseAdmin } from '../lib/supabase-admin';

async function testQuoteRequestsTable() {
  console.log('🔍 Verificando acceso a la tabla quote_requests...');
  
  // Intentar hacer un SELECT simple
  const { data, error } = await supabaseAdmin
    .from('quote_requests')
    .select('*')
    .limit(1);

  if (error) {
    console.error('❌ Error al acceder a la tabla:');
    console.error(JSON.stringify(error, null, 2));
    
    // Verificar que otras tablas sí funcionan
    console.log('\n🔍 Verificando acceso a tabla agencies...');
    const { data: agenciesData, error: agenciesError } = await supabaseAdmin
      .from('agencies')
      .select('id, name')
      .limit(1);
    
    if (agenciesError) {
      console.error('❌ Error al acceder a agencies:', agenciesError);
    } else {
      console.log('✅ Tabla agencies accesible:', agenciesData);
    }
    
    return;
  }

  console.log('✅ Tabla quote_requests accesible');
  console.log('Data:', data);
}

testQuoteRequestsTable()
  .then(() => {
    console.log('\n✅ Test completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
