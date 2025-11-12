-- Script para crear tablas de registro y tracking de clientes
-- Ejecutar en Supabase SQL Editor (Development y Production)

-- Tabla de perfiles de clientes
CREATE TABLE IF NOT EXISTS client_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_name TEXT,
  business_instagram TEXT,
  budget_range TEXT CHECK (budget_range IN ('$', '$$', '$$$')),
  desired_categories TEXT[],
  about_business TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Índice para búsquedas rápidas por user_id
CREATE INDEX IF NOT EXISTS idx_client_profiles_user_id ON client_profiles(user_id);

-- Tabla de tracking de contactos entre clientes y agencias
CREATE TABLE IF NOT EXISTS agency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  contact_method TEXT NOT NULL CHECK (contact_method IN ('email', 'phone', 'website', 'form')),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsquedas eficientes
CREATE INDEX IF NOT EXISTS idx_agency_contacts_client ON agency_contacts(client_user_id);
CREATE INDEX IF NOT EXISTS idx_agency_contacts_agency ON agency_contacts(agency_id);
CREATE INDEX IF NOT EXISTS idx_agency_contacts_created_at ON agency_contacts(created_at DESC);

-- Verificar que se crearon correctamente
SELECT 
  'client_profiles' as table_name,
  COUNT(*) as total_records
FROM client_profiles
UNION ALL
SELECT 
  'agency_contacts' as table_name,
  COUNT(*) as total_records
FROM agency_contacts;
