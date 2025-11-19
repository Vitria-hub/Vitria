import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function findUser() {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();
  
  if (error) {
    console.error('Error:', error);
    return;
  }

  const user = data.users.find(u => u.email === 'joselarrainc22@gmail.com');
  
  if (user) {
    console.log('\n=== Usuario en Supabase Auth ===');
    console.log('ID:', user.id);
    console.log('Email:', user.email);
    console.log('Creado:', user.created_at);
    console.log('Último login:', user.last_sign_in_at);
    console.log('Provider:', user.app_metadata.provider);
    console.log('Providers:', user.app_metadata.providers);
  } else {
    console.log('Usuario NO encontrado en Supabase Auth');
  }
}

findUser().catch(console.error);
