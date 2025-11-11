import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE;

if (!supabaseUrl || !supabaseServiceRole) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRole, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupDatabase() {
  console.log('🚀 Configurando usuario administrador...\n');

  // 1. Crear usuario admin en auth.users
  console.log('👤 Creando usuario administrador...');
  
  const adminEmail = 'contacto@scalelab.cl';
  const adminPassword = 'Scalelab2026';
  
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true
  });

  if (authError) {
    console.error('❌ Error creando usuario auth:', authError.message);
    // Intentar obtener el usuario si ya existe
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === adminEmail);
    
    if (existingUser) {
      console.log('ℹ️  Usuario ya existe, usando el existente');
      authData.user = existingUser;
    } else {
      process.exit(1);
    }
  } else {
    console.log('✅ Usuario de autenticación creado');
  }

  const authUserId = authData.user.id;

  // 3. Crear registro en tabla users con rol admin
  console.log('🔑 Asignando rol de administrador...');
  
  const { error: userError } = await supabase
    .from('users')
    .upsert({
      auth_id: authUserId,
      full_name: 'Administrador ScaleLab',
      role: 'admin'
    }, {
      onConflict: 'auth_id'
    });

  if (userError) {
    console.error('❌ Error creando usuario en tabla users:', userError.message);
    process.exit(1);
  }

  console.log('✅ Rol de administrador asignado\n');

  // 4. Verificar
  const { data: verifyUser } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', authUserId)
    .single();

  console.log('🎉 ¡Configuración completada!\n');
  console.log('📧 Email:', adminEmail);
  console.log('🔒 Contraseña:', adminPassword);
  console.log('👑 Rol:', verifyUser?.role);
  console.log('\n✨ Ya puedes hacer clic en el botón "🔐 Admin" en el menú');
}

setupDatabase().catch(console.error);
