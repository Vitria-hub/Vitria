import { db } from '../server/db';

async function checkAgencyData() {
  console.log('🔍 Verificando datos de Scale Lab...');
  
  const { data, error } = await db
    .from('agencies')
    .select('id, name, email, phone, whatsapp_number, website, is_premium, location_city')
    .eq('slug', 'scale-lab')
    .single();
  
  if (error) {
    console.error('❌ Error:', error);
  } else {
    console.log('\n📊 Datos completos de Scale Lab:');
    console.log(JSON.stringify(data, null, 2));
  }
  
  process.exit(0);
}

checkAgencyData();
