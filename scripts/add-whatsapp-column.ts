import { db } from '../server/db';

async function addWhatsappColumn() {
  console.log('📝 Agregando columna whatsapp_number...');
  
  try {
    // Use raw SQL to add the column
    const { error } = await db.rpc('exec_sql', {
      sql_query: `
        ALTER TABLE agencies 
        ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;
      `
    });
    
    if (error) {
      console.error('❌ Error:', error);
      console.log('\n💡 Agrega la columna manualmente en Supabase SQL Editor:');
      console.log('ALTER TABLE agencies ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;');
    } else {
      console.log('✅ Columna whatsapp_number agregada exitosamente');
    }
  } catch (err: any) {
    console.error('❌ Error:', err.message);
    console.log('\n💡 Agrega la columna manualmente en Supabase SQL Editor:');
    console.log('ALTER TABLE agencies ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;');
  }
  
  process.exit(0);
}

addWhatsappColumn();
