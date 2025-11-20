import { supabaseAdmin } from '../lib/supabase-admin';

async function createQuoteRequestsTable() {
  console.log('🔧 Creando tabla quote_requests en Supabase...');
  
  // Usar SQL raw para crear la tabla directamente en Supabase
  const { data, error } = await supabaseAdmin.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS quote_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
        client_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        client_name VARCHAR(255) NOT NULL,
        client_email VARCHAR(255) NOT NULL,
        client_phone VARCHAR(50),
        project_name VARCHAR(255) NOT NULL,
        project_description TEXT NOT NULL,
        budget_range VARCHAR(100),
        service_category VARCHAR(100),
        status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'won', 'lost')),
        admin_notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Crear índices
      CREATE INDEX IF NOT EXISTS idx_quote_requests_agency_id ON quote_requests(agency_id);
      CREATE INDEX IF NOT EXISTS idx_quote_requests_client_user_id ON quote_requests(client_user_id);
      CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);
      CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON quote_requests(created_at DESC);
    `
  });

  if (error) {
    console.error('❌ Error:', error);
    throw error;
  }

  console.log('✅ Tabla creada exitosamente');
  console.log('Data:', data);
}

createQuoteRequestsTable()
  .then(() => {
    console.log('✅ Proceso completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
