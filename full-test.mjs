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

async function fullTest() {
  console.log('🧪 Test completo de autenticación admin\n');
  console.log('='.repeat(50));
  
  // 1. Login
  console.log('\n1️⃣ PASO 1: Login con credenciales');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'contacto@scalelab.cl',
    password: 'Scalelab2026'
  });

  if (authError) {
    console.log('   ❌ ERROR:', authError.message);
    return;
  }
  console.log('   ✅ Login exitoso');
  console.log('   📧 Email:', authData.user.email);
  console.log('   🔑 Auth ID:', authData.user.id);
  
  // 2. Obtener sesión
  console.log('\n2️⃣ PASO 2: Verificar sesión activa');
  const { data: { session } } = await supabase.auth.getSession();
  console.log('   ✅ Sesión activa');
  console.log('   🎫 Access Token:', session.access_token.substring(0, 20) + '...');
  
  // 3. Obtener datos de usuario desde tabla users
  console.log('\n3️⃣ PASO 3: Obtener datos de usuario desde tabla users');
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', authData.user.id)
    .single();

  if (userError) {
    console.log('   ❌ ERROR obteniendo userData:', userError.message);
    console.log('   ℹ️  Error detail:', userError);
  } else {
    console.log('   ✅ Usuario obtenido de tabla users');
    console.log('   👤 Nombre:', userData.full_name);
    console.log('   👑 Rol:', userData.role);
    console.log('   🆔 User ID:', userData.id);
  }
  
  // 4. Verificar permiso de admin
  console.log('\n4️⃣ PASO 4: Verificar permisos de admin');
  if (userData && userData.role === 'admin') {
    console.log('   ✅ Usuario tiene rol ADMIN');
    console.log('   ✅ Puede acceder a /admin');
  } else {
    console.log('   ❌ Usuario NO tiene rol admin');
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('\n📝 RESUMEN:');
  if (userData && userData.role === 'admin') {
    console.log('✅ TODO ESTÁ CORRECTO');
    console.log('✅ El usuario puede acceder al panel de admin');
  } else {
    console.log('❌ HAY UN PROBLEMA');
    console.log('❌ El usuario NO puede acceder al panel de admin');
  }
  
  // Cerrar sesión
  await supabase.auth.signOut();
}

fullTest().catch(console.error);
