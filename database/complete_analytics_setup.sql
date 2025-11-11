-- CREAR TABLAS DE ANALYTICS

-- Tabla para registrar todas las interacciones (vistas, clicks)
CREATE TABLE IF NOT EXISTS interaction_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id uuid NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  interaction_type text NOT NULL,
  session_id text,
  user_agent text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Tabla para analytics de búsquedas
CREATE TABLE IF NOT EXISTS search_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  search_query text,
  service_category text,
  location_filter text,
  results_count integer NOT NULL,
  agencies_shown uuid[] DEFAULT '{}',
  clicked_agency_id uuid REFERENCES agencies(id) ON DELETE SET NULL,
  clicked_position integer,
  session_id text,
  created_at timestamptz DEFAULT now()
);

-- Tabla para métricas diarias agregadas por agencia
CREATE TABLE IF NOT EXISTS agency_metrics_daily (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id uuid NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  metric_date date NOT NULL,
  views integer DEFAULT 0,
  unique_visitors integer DEFAULT 0,
  phone_clicks integer DEFAULT 0,
  email_clicks integer DEFAULT 0,
  website_clicks integer DEFAULT 0,
  form_submissions integer DEFAULT 0,
  search_appearances integer DEFAULT 0,
  search_clicks integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(agency_id, metric_date)
);

-- CREAR FUNCIONES PARA AGREGACIONES

-- Función para obtener estadísticas de vistas por agencia
CREATE OR REPLACE FUNCTION get_agency_view_stats(start_date timestamptz)
RETURNS TABLE (
  agency_id uuid,
  view_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    il.agency_id::uuid,
    COUNT(*) as view_count
  FROM interaction_logs il
  WHERE 
    il.interaction_type = 'view'
    AND il.created_at >= start_date
  GROUP BY il.agency_id;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener estadísticas de contactos por agencia
CREATE OR REPLACE FUNCTION get_agency_contact_stats(start_date timestamptz)
RETURNS TABLE (
  agency_id uuid,
  contact_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    il.agency_id::uuid,
    COUNT(*) as contact_count
  FROM interaction_logs il
  WHERE 
    il.interaction_type IN ('phone_click', 'email_click', 'website_click', 'form_submit')
    AND il.created_at >= start_date
  GROUP BY il.agency_id;
END;
$$ LANGUAGE plpgsql;

-- CREAR ÍNDICES PARA MEJORAR PERFORMANCE

CREATE INDEX IF NOT EXISTS idx_interaction_logs_agency_type_date 
ON interaction_logs(agency_id, interaction_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_interaction_logs_session_type 
ON interaction_logs(session_id, interaction_type);

CREATE INDEX IF NOT EXISTS idx_search_analytics_clicked_agency 
ON search_analytics(clicked_agency_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_search_analytics_date 
ON search_analytics(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_agency_metrics_daily_agency_date
ON agency_metrics_daily(agency_id, metric_date DESC);

-- CREAR POLÍTICAS RLS (Row Level Security)

-- Habilitar RLS en las tablas
ALTER TABLE interaction_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_metrics_daily ENABLE ROW LEVEL SECURITY;

-- Solo admins pueden leer analytics
CREATE POLICY "Only admins can read interaction_logs"
ON interaction_logs FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND users.role = 'admin'
  )
);

CREATE POLICY "Only admins can read search_analytics"
ON search_analytics FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND users.role = 'admin'
  )
);

CREATE POLICY "Only admins can read agency_metrics_daily"
ON agency_metrics_daily FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND users.role = 'admin'
  )
);
