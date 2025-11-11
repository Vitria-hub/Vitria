import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAdminLogin() {
  console.log('🔐 Probando inicio de sesión admin...\n');
  
  // 1. Intentar login
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'contacto@scalelab.cl',
    password: 'Scalelab2026'
  });

  if (authError) {
    console.log('❌ Error en login:', authError.message);
    return;
  }

  console.log('✅ Login exitoso');
  console.log('📧 Email:', authData.user.email);
  console.log('🆔 User ID:', authData.user.id);
  
  // 2. Verificar datos de usuario en tabla users
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', authData.user.id)
    .single();

  if (userError) {
    console.log('❌ Error obteniendo usuario:', userError.message);
    return;
  }

  console.log('\n👤 Datos de usuario:');
  console.log('   Nombre:', userData.full_name);
  console.log('   Rol:', userData.role);
  console.log('   Creado:', userData.created_at);
  
  if (userData.role === 'admin') {
    console.log('\n✅ ¡Usuario confirmado como ADMIN!');
  } else {
    console.log('\n❌ Usuario NO es admin, rol actual:', userData.role);
  }
  
  // Cerrar sesión
  await supabase.auth.signOut();
}

testAdminLogin().catch(console.error);
