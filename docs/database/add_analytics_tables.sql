-- Script para agregar tablas de analytics
-- Ejecutar solo las nuevas tablas sin afectar las existentes

-- Actualizar tabla de métricas diarias (agregar nuevas columnas)
ALTER TABLE public.agency_metrics_daily 
ADD COLUMN IF NOT EXISTS unique_visitors int default 0,
ADD COLUMN IF NOT EXISTS phone_clicks int default 0,
ADD COLUMN IF NOT EXISTS email_clicks int default 0,
ADD COLUMN IF NOT EXISTS website_clicks int default 0,
ADD COLUMN IF NOT EXISTS form_submissions int default 0,
ADD COLUMN IF NOT EXISTS search_appearances int default 0,
ADD COLUMN IF NOT EXISTS avg_position numeric(4,2) default 0;

-- Logs de interacciones individuales
CREATE TABLE IF NOT EXISTS public.interaction_logs (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references public.agencies(id) on delete cascade,
  user_id uuid references public.users(id) on delete set null,
  interaction_type text not null check (interaction_type in ('view','phone_click','email_click','website_click','form_submit','search_appear','search_click')),
  session_id text,
  user_agent text,
  ip_address inet,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Analytics de búsquedas
CREATE TABLE IF NOT EXISTS public.search_analytics (
  id uuid primary key default gen_random_uuid(),
  search_query text,
  service_category text,
  location_filter text,
  results_count int not null,
  agencies_shown uuid[],
  clicked_agency_id uuid references public.agencies(id) on delete set null,
  clicked_position int,
  user_id uuid references public.users(id) on delete set null,
  session_id text,
  created_at timestamptz default now()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS interaction_logs_agency_created ON public.interaction_logs (agency_id, created_at desc);
CREATE INDEX IF NOT EXISTS interaction_logs_type_created ON public.interaction_logs (interaction_type, created_at desc);
CREATE INDEX IF NOT EXISTS search_analytics_created ON public.search_analytics (created_at desc);
CREATE INDEX IF NOT EXISTS search_analytics_clicked ON public.search_analytics (clicked_agency_id, created_at desc) WHERE clicked_agency_id is not null;

-- RLS para las nuevas tablas
ALTER TABLE public.interaction_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_analytics ENABLE ROW LEVEL SECURITY;

-- Políticas: Solo admin puede leer analytics
CREATE POLICY "Admins can read interaction logs"
  ON public.interaction_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert interaction logs"
  ON public.interaction_logs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can read search analytics"
  ON public.search_analytics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert search analytics"
  ON public.search_analytics FOR INSERT
  WITH CHECK (true);
