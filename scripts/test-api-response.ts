import { db } from '../server/db';
import { supabaseAdmin } from '../lib/supabase-admin';

async function testApiResponse() {
  console.log('🧪 Simulando llamada al API getBySlug...\n');
  
  // Simular un token de usuario
  const token = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IlhiOHdKWFJDYmJDR1R1M1EiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2Njd29zZGF4bXRmemJxY3JyZnZkLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJkZTVmODFiYy00ODQ2LTQ0ZTEtYWZiNC1lMWFmYzY3YWYxZDgiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzYzNTg1NzI0LCJpYXQiOjE3NjM1ODIxMjQsImVtYWlsIjoiam9zZW1hcmlhLmxhcnJhaW5AZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJnb29nbGUiLCJwcm92aWRlcnMiOlsiZ29vZ2xlIl19LCJ1c2VyX21ldGFkYXRhIjp7ImF2YXRhcl91cmwiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NJbDFmZHdEWkdyaTJvdm5GbnNRRU5jS3doR0hEWHhkRWhZZXZGSkM5ZHQ4b2ZyPXM5Ni1jIiwiZW1haWwiOiJqb3NlbWFyaWEubGFycmFpbkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZnVsbF9uYW1lIjoiSm9zZW1hcsOtYSBMYXJyYcOtbiIsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbSIsIm5hbWUiOiJKb3NlbWFyw61hIExhcnJhw61uIiwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSWwxZmR3RFpHcmkyb3ZuRm5zUUVOY0t3aEdIRFh4ZEVoWWV2RkpDOWR0OG9mcj1zOTYtYyIsInByb3ZpZGVyX2lkIjoiMTA4Njk5MjY3ODM4NTQ1MDE0MDA3Iiwic3ViIjoiMTA4Njk5MjY3ODM4NTQ1MDE0MDA3In0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib2F1dGgiLCJ0aW1lc3RhbXAiOjE3NjM1NzUyNzJ9XSwic2Vzc2lvbl9pZCI6IjdhNzk2NTVlLTVhZjAtNDhmZC05YTM0LTI4MGZjZWJmYTllNyIsImlzX2Fub255bW91cyI6ZmFsc2V9.FcuBDCT6Bqe0E3v0Sg7sFhN5C-GYnTqexJ4VoUBNwUI';
  
  // Simular autenticación
  const { data: { user: authUser } } = await supabaseAdmin.auth.getUser(token);
  
  if (!authUser) {
    console.log('❌ Token inválido');
    process.exit(1);
  }
  
  console.log('✅ Usuario autenticado:', authUser.id);
  
  const { data: userData } = await supabaseAdmin
    .from('users')
    .select('id, role, full_name, avatar_url')
    .eq('auth_id', authUser.id)
    .single();
  
  console.log('✅ Datos de usuario:', userData);
  console.log('✅ userId para contexto:', authUser.id);
  
  // Obtener agencia
  const { data: agency, error } = await db
    .from('agencies')
    .select('*')
    .eq('slug', 'scale-lab')
    .eq('approval_status', 'approved')
    .maybeSingle();
  
  if (error) {
    console.log('❌ Error:', error);
    process.exit(1);
  }
  
  if (!agency) {
    console.log('❌ Agencia no encontrada');
    process.exit(1);
  }
  
  console.log('\n📊 Datos completos de la agencia:');
  console.log('ID:', agency.id);
  console.log('Nombre:', agency.name);
  console.log('Premium:', agency.is_premium);
  console.log('Email:', agency.email);
  console.log('Phone:', agency.phone);
  console.log('WhatsApp:', agency.whatsapp_number);
  console.log('Website:', agency.website);
  console.log('Ciudad:', agency.location_city);
  console.log('Región:', agency.location_region);
  
  // Simular el filtro del endpoint
  const isAuthenticated = !!authUser.id;
  console.log('\n🔒 Usuario autenticado:', isAuthenticated);
  
  if (!isAuthenticated) {
    console.log('❌ Se filtrarían los datos de contacto');
  } else {
    console.log('✅ Se devolverían TODOS los datos (incluyendo contacto)');
  }
  
  process.exit(0);
}

testApiResponse();
