-- Función para obtener estadísticas de vistas por agencia (agregadas en base de datos)
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

-- Función para obtener estadísticas de contactos por agencia (agregadas en base de datos)
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

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_interaction_logs_agency_type_date 
ON interaction_logs(agency_id, interaction_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_interaction_logs_session_type 
ON interaction_logs(session_id, interaction_type);

CREATE INDEX IF NOT EXISTS idx_search_analytics_clicked_agency 
ON search_analytics(clicked_agency_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_search_analytics_date 
ON search_analytics(created_at DESC);
