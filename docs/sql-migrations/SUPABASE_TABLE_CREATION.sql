-- ================================================
-- CREAR TABLA quote_requests EN SUPABASE
-- ================================================
-- IMPORTANTE: Ejecuta este SQL en tu dashboard de Supabase
-- (https://supabase.com/dashboard/project/ccwosdaxmtfzbqcrrfvd/editor)

-- 1. Crear la tabla
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

-- 2. Crear índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_quote_requests_agency_id ON quote_requests(agency_id);
CREATE INDEX IF NOT EXISTS idx_quote_requests_client_user_id ON quote_requests(client_user_id);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON quote_requests(created_at DESC);

-- 3. Agregar comentario a la tabla
COMMENT ON TABLE quote_requests IS 'Solicitudes de cotización enviadas por clientes a agencias';

-- 4. Habilitar Row Level Security (RLS)
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- 5. Crear políticas de seguridad (RLS Policies)

-- Política: Permitir a usuarios autenticados crear cotizaciones
CREATE POLICY "Anyone can create quote requests"
  ON quote_requests
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Política: Las agencias pueden ver sus propias cotizaciones
CREATE POLICY "Agencies can view their own quotes"
  ON quote_requests
  FOR SELECT
  TO authenticated
  USING (
    agency_id IN (
      SELECT id FROM agencies WHERE owner_id = auth.uid()
    )
  );

-- Política: Los admins pueden ver todas las cotizaciones
CREATE POLICY "Admins can view all quotes"
  ON quote_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Política: Las agencias pueden actualizar sus propias cotizaciones
CREATE POLICY "Agencies can update their own quotes"
  ON quote_requests
  FOR UPDATE
  TO authenticated
  USING (
    agency_id IN (
      SELECT id FROM agencies WHERE owner_id = auth.uid()
    )
  )
  WITH CHECK (
    agency_id IN (
      SELECT id FROM agencies WHERE owner_id = auth.uid()
    )
  );

-- Política: Los admins pueden actualizar todas las cotizaciones
CREATE POLICY "Admins can update all quotes"
  ON quote_requests
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- ================================================
-- VERIFICACIÓN
-- ================================================
-- Después de ejecutar el SQL, verifica que funcionó:
SELECT COUNT(*) as total_quotes FROM quote_requests;
