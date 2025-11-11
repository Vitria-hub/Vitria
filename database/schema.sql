-- Habilitar extensiones necesarias
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- Usuarios
create table public.users (
  id uuid primary key default gen_random_uuid(),
  auth_id uuid unique not null,
  full_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('user','agency','admin')),
  created_at timestamptz default now()
);

-- Agencias
create table public.agencies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.users(id) on delete cascade,
  name text not null,
  slug text unique not null,
  logo_url text,
  cover_url text,
  description text,
  website text,
  email text,
  phone text,
  location_city text,
  location_region text,
  employees_min int,
  employees_max int,
  price_range text,
  services text[] not null,
  categories text[] not null,
  is_verified bool default false,
  is_premium bool default false,
  premium_until timestamptz,
  avg_rating numeric(3,2) default 0,
  reviews_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Portafolio
create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references public.agencies(id) on delete cascade,
  title text not null,
  description text,
  media_urls text[],
  client_name text,
  tags text[],
  published_at timestamptz default now()
);

-- Reseñas
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references public.agencies(id) on delete cascade,
  user_id uuid references public.users(id) on delete set null,
  rating int not null check (rating between 1 and 5),
  comment text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  reported bool default false,
  created_at timestamptz default now()
);

-- Planes y suscripciones
create table public.plans (
  id text primary key,
  name text not null,
  price_month_cents int not null,
  benefits text[] not null
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references public.agencies(id) on delete cascade,
  plan_id text references public.plans(id),
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null check (status in ('active','past_due','canceled')),
  current_period_end timestamptz,
  created_at timestamptz default now()
);

-- Patrocinios
create table public.sponsored_slots (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references public.agencies(id) on delete cascade,
  position int not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null
);

-- Métricas diarias agregadas
create table public.agency_metrics_daily (
  day date not null,
  agency_id uuid references public.agencies(id) on delete cascade,
  views int default 0,
  unique_visitors int default 0,
  profile_clicks int default 0,
  contact_clicks int default 0,
  phone_clicks int default 0,
  email_clicks int default 0,
  website_clicks int default 0,
  form_submissions int default 0,
  search_appearances int default 0,
  avg_position numeric(4,2) default 0,
  leads int default 0,
  primary key (day, agency_id)
);

-- Logs de interacciones individuales
create table public.interaction_logs (
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
create table public.search_analytics (
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

-- Índices
create index agencies_gin_services on public.agencies using gin (services);
create index agencies_gin_categories on public.agencies using gin (categories);
create index agencies_trgm_name on public.agencies using gin (name gin_trgm_ops);
create index agencies_loc on public.agencies (location_region, location_city);
create index reviews_agency_status on public.reviews (agency_id, status);
create index interaction_logs_agency_created on public.interaction_logs (agency_id, created_at desc);
create index interaction_logs_type_created on public.interaction_logs (interaction_type, created_at desc);
create index search_analytics_created on public.search_analytics (created_at desc);
create index search_analytics_clicked on public.search_analytics (clicked_agency_id, created_at desc) where clicked_agency_id is not null;

-- Trigger para rating promedio
create or replace function update_agency_rating() returns trigger as $$
begin
  update public.agencies a
  set avg_rating = sub.avg_rating, reviews_count = sub.cnt
  from (
    select agency_id, avg(rating)::numeric(3,2) as avg_rating, count(*) cnt
    from public.reviews
    where status='approved' and agency_id=COALESCE(NEW.agency_id, OLD.agency_id)
    group by agency_id
  ) sub
  where a.id = sub.agency_id;
  return null;
end;
$$ language plpgsql;

create trigger t_reviews_after_change
after insert or update or delete on public.reviews
for each row execute procedure update_agency_rating();

-- RLS Policies (Row Level Security)
alter table public.users enable row level security;
alter table public.agencies enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.reviews enable row level security;
alter table public.subscriptions enable row level security;
alter table public.sponsored_slots enable row level security;
alter table public.agency_metrics_daily enable row level security;
alter table public.interaction_logs enable row level security;
alter table public.search_analytics enable row level security;

-- Políticas públicas de lectura
create policy "Allow public read access to agencies"
  on public.agencies for select
  using (true);

create policy "Allow public read access to approved reviews"
  on public.reviews for select
  using (status = 'approved');

create policy "Allow public read access to portfolio"
  on public.portfolio_items for select
  using (true);

create policy "Allow public read access to sponsored slots"
  on public.sponsored_slots for select
  using (true);
