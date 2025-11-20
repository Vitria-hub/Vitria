-- ================================================
-- ARREGLAR PERMISOS DE quote_requests
-- ================================================
-- Ejecuta esto en tu SQL Editor de Supabase

-- 1. Eliminar todas las políticas existentes (empezar de cero)
DROP POLICY IF EXISTS "Anyone can create quote requests" ON quote_requests;
DROP POLICY IF EXISTS "Agencies can view their own quotes" ON quote_requests;
DROP POLICY IF EXISTS "Admins can view all quotes" ON quote_requests;
DROP POLICY IF EXISTS "Agencies can update their own quotes" ON quote_requests;
DROP POLICY IF EXISTS "Admins can update all quotes" ON quote_requests;

-- 2. Deshabilitar RLS temporalmente para verificar
ALTER TABLE quote_requests DISABLE ROW LEVEL SECURITY;

-- 3. Dar permisos completos a usuarios autenticados y anónimos
GRANT ALL ON quote_requests TO authenticated;
GRANT ALL ON quote_requests TO anon;
GRANT ALL ON quote_requests TO service_role;

-- 4. Re-habilitar RLS
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- 5. Crear políticas más permisivas

-- Permitir a TODOS (incluso anónimos) crear cotizaciones
CREATE POLICY "Enable insert for all users"
  ON quote_requests
  FOR INSERT
  WITH CHECK (true);

-- Permitir a usuarios autenticados ver cotizaciones
CREATE POLICY "Enable read for authenticated users"
  ON quote_requests
  FOR SELECT
  TO authenticated
  USING (
    -- Las agencias ven sus cotizaciones
    agency_id IN (
      SELECT id FROM agencies WHERE owner_id = auth.uid()
    )
    OR
    -- Los admins ven todas
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
    OR
    -- Los clientes ven sus cotizaciones
    client_user_id = auth.uid()
  );

-- Permitir a usuarios autenticados actualizar cotizaciones
CREATE POLICY "Enable update for authenticated users"
  ON quote_requests
  FOR UPDATE
  TO authenticated
  USING (
    -- Las agencias pueden actualizar sus cotizaciones
    agency_id IN (
      SELECT id FROM agencies WHERE owner_id = auth.uid()
    )
    OR
    -- Los admins pueden actualizar todas
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- 6. Verificar que funcionó
SELECT COUNT(*) as total FROM quote_requests;

-- Si ves un número (incluso 0), ¡funcionó!
