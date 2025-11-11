import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE;

const supabase = createClient(supabaseUrl, supabaseServiceRole);

async function checkUsers() {
  // Buscar usuarios con este email en auth.users
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  
  const adminAuthUser = users.find(u => u.email === 'contacto@scalelab.cl');
  
  if (!adminAuthUser) {
    console.log('❌ No se encontró usuario auth');
    return;
  }
  
  console.log('✅ Usuario auth encontrado:', adminAuthUser.id);
  
  // Buscar en tabla users
  const { data: userRecords, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', adminAuthUser.id);
  
  console.log('\n📋 Registros en tabla users:');
  console.log('   Cantidad:', userRecords?.length || 0);
  
  if (userRecords && userRecords.length > 0) {
    userRecords.forEach((u, i) => {
      console.log(`   [${i+1}] ID: ${u.id}, Rol: ${u.role}, Nombre: ${u.full_name}`);
    });
  }
}

checkUsers().catch(console.error);
