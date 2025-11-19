import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE;

const db = createClient(supabaseUrl, supabaseKey);

console.log('🧪 Probando actualización de agencia con nuevos campos...\n');

const agencyId = '10000000-0000-0000-0000-000000000002';

const updateData = {
  whatsapp_number: '+56987654321',
  facebook_url: 'https://facebook.com/creativastudio',
  instagram_url: 'https://instagram.com/creativastudio',
  linkedin_url: 'https://linkedin.com/company/creativastudio',
  twitter_url: 'https://twitter.com/creativastudio',
  youtube_url: 'https://youtube.com/@creativastudio',
  tiktok_url: 'https://tiktok.com/@creativastudio',
  description: 'Agencia creativa especializada en marketing digital - ACTUALIZADO CON PRUEBA'
};

try {
  const { data, error } = await db
    .from('agencies')
    .update(updateData)
    .eq('id', agencyId)
    .select('id, name, whatsapp_number, facebook_url, instagram_url, linkedin_url, twitter_url, youtube_url, tiktok_url, description')
    .single();

  if (error) {
    console.error('❌ Error al actualizar:', error);
    process.exit(1);
  }

  console.log('✅ Agencia actualizada exitosamente!\n');
  console.log('📋 Datos actualizados:');
  console.log(JSON.stringify(data, null, 2));
  
} catch (err) {
  console.error('❌ Error:', err);
  process.exit(1);
}
