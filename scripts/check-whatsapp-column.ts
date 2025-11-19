import { db } from '../server/db';

async function checkWhatsappColumn() {
  console.log('🔍 Verificando columna whatsapp_number...');
  
  try {
    const { data, error } = await db
      .from('agencies')
      .select('id, name, phone, whatsapp_number')
      .limit(1);
    
    if (error) {
      console.error('❌ Error al consultar:', error.message);
      if (error.message.includes('whatsapp_number')) {
        console.log('\n⚠️  La columna whatsapp_number NO existe en la base de datos');
        console.log('📝 Necesitas agregar la columna manualmente en Supabase');
      }
    } else {
      console.log('✅ La columna whatsapp_number existe');
      console.log('📊 Datos de ejemplo:', data);
    }
  } catch (err: any) {
    console.error('❌ Error:', err.message);
  }
  
  process.exit(0);
}

checkWhatsappColumn();
