-- ================================================
-- STEP 4: POPULATE WITH SAMPLE DATA
-- ================================================
-- Run this after step 3 to add realistic test data

-- ================================================
-- 1. INSERT PLANS
-- ================================================

INSERT INTO plans (id, name, price_month_cents, benefits) VALUES
('free', 'Gratis', 0, ARRAY[
  'Perfil básico de agencia',
  'Hasta 5 proyectos en portafolio',
  'Listado en directorio',
  'Métricas básicas'
]),
('premium', 'Premium', 29990, ARRAY[
  'Todo lo de Gratis',
  'Destacado en búsquedas',
  'Portafolio ilimitado',
  'Badge premium verificado',
  'Métricas avanzadas',
  'Soporte prioritario'
]);

-- ================================================
-- 2. INSERT SAMPLE USERS (FOR TESTING)
-- ================================================
-- Note: In production, real users will be created via auth trigger
-- These are for demo purposes only

INSERT INTO users (id, auth_id, full_name, avatar_url, role) VALUES
-- Admin user
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Admin Vitria', null, 'admin'),
-- Agency owners
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'María González', null, 'agency'),
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'Carlos Pérez', null, 'agency'),
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', 'Andrea Silva', null, 'agency'),
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005', 'Roberto Muñoz', null, 'agency'),
-- Regular users/clients
('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000006', 'Valentina Torres', null, 'user'),
('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000007', 'Diego Ramírez', null, 'user'),
('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000008', 'Camila Morales', null, 'user');

-- ================================================
-- 3. INSERT SAMPLE AGENCIES
-- ================================================

INSERT INTO agencies (id, owner_id, name, slug, description, website, email, phone, location_city, location_region, services, categories, is_verified, is_premium, approval_status, approved_at, created_at) VALUES

-- Agency 1: Premium Digital Marketing
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 
'Impulso Digital', 'impulso-digital',
'Agencia de marketing digital especializada en estrategias para e-commerce y startups. Más de 10 años transformando marcas en el mercado chileno.',
'https://impulsodigital.cl', 'contacto@impulsodigital.cl', '+56912345678',
'Santiago', 'Metropolitana',
ARRAY['Marketing Digital', 'SEO/SEM', 'Redes Sociales', 'E-commerce'],
ARRAY['Marketing', 'Digital'],
true, true, 'approved', NOW() - INTERVAL '30 days', NOW() - INTERVAL '90 days'),

-- Agency 2: Creative Branding
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003',
'Creativa Studio', 'creativa-studio',
'Estudio creativo enfocado en branding, diseño gráfico e identidad visual. Trabajamos con empresas que buscan diferenciarse.',
'https://creativastudio.cl', 'hola@creativastudio.cl', '+56987654321',
'Valparaíso', 'Valparaíso',
ARRAY['Branding', 'Diseño Gráfico', 'Identidad Visual'],
ARRAY['Branding', 'Diseño'],
true, false, 'approved', NOW() - INTERVAL '15 days', NOW() - INTERVAL '60 days'),

-- Agency 3: Advertising Agency
('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004',
'AdWorks Chile', 'adworks-chile',
'Agencia de publicidad 360° con presencia en todo Chile. Campañas creativas que generan resultados medibles.',
'https://adworks.cl', 'info@adworks.cl', '+56911223344',
'Concepción', 'Biobío',
ARRAY['Publicidad', 'Campañas', 'Producción Audiovisual', 'Marketing Digital'],
ARRAY['Publicidad', 'Marketing'],
true, true, 'approved', NOW() - INTERVAL '20 days', NOW() - INTERVAL '120 days'),

-- Agency 4: Social Media Specialists
('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000005',
'Social Media Lab', 'social-media-lab',
'Especialistas en gestión de redes sociales y marketing de influencers. Conectamos marcas con audiencias.',
'https://socialmedialab.cl', 'contacto@socialmedialab.cl', '+56955667788',
'Santiago', 'Metropolitana',
ARRAY['Redes Sociales', 'Community Management', 'Influencer Marketing', 'Content Creation'],
ARRAY['Marketing', 'Digital'],
true, false, 'approved', NOW() - INTERVAL '10 days', NOW() - INTERVAL '45 days'),

-- Agency 5: Pending approval (for testing approval flow)
('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002',
'Nueva Agencia Test', 'nueva-agencia-test',
'Agencia en espera de aprobación para testing.',
'https://nuevaagencia.cl', 'test@nueva.cl', '+56999887766',
'Santiago', 'Metropolitana',
ARRAY['Marketing Digital'],
ARRAY['Marketing'],
false, false, 'pending', null, NOW() - INTERVAL '2 days');

-- ================================================
-- 4. INSERT SAMPLE REVIEWS
-- ================================================

INSERT INTO reviews (agency_id, user_id, rating, comment, status, created_at) VALUES
-- Reviews for Impulso Digital
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000006', 5, 
'Excelente trabajo con nuestra campaña de e-commerce. Aumentamos ventas en 200% en 3 meses.', 
'approved', NOW() - INTERVAL '25 days'),

('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000007', 5,
'Profesionales, creativos y con resultados medibles. Totalmente recomendados.',
'approved', NOW() - INTERVAL '18 days'),

('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000008', 4,
'Muy buen servicio, aunque los plazos fueron un poco más largos de lo esperado.',
'approved', NOW() - INTERVAL '10 days'),

-- Reviews for Creativa Studio
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000006', 5,
'Rediseñaron nuestra marca completa. El resultado superó nuestras expectativas.',
'approved', NOW() - INTERVAL '12 days'),

('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000007', 4,
'Creativos y profesionales. Buena relación calidad-precio.',
'approved', NOW() - INTERVAL '8 days'),

-- Reviews for AdWorks Chile
('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000008', 5,
'Campaña publicitaria increíble. Generó mucho engagement y ventas.',
'approved', NOW() - INTERVAL '15 days'),

-- Pending review (for testing moderation)
('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000006', 5,
'Review pendiente de aprobación para testing.',
'pending', NOW() - INTERVAL '1 day');

-- ================================================
-- 5. INSERT SAMPLE PORTFOLIO ITEMS
-- ================================================

INSERT INTO portfolio_items (agency_id, title, description, client_name, tags, published_at) VALUES
('10000000-0000-0000-0000-000000000001', 
'Campaña E-commerce Fashion Store', 
'Estrategia completa de marketing digital para tienda de moda online, incluyendo SEO, SEM y redes sociales.',
'Fashion Store Chile',
ARRAY['E-commerce', 'Fashion', 'SEO', 'SEM'],
NOW() - INTERVAL '20 days'),

('10000000-0000-0000-0000-000000000001',
'Lanzamiento Producto Tech',
'Campaña de lanzamiento de producto tecnológico con influencers y publicidad digital.',
'TechStart',
ARRAY['Lanzamiento', 'Tech', 'Influencers'],
NOW() - INTERVAL '40 days'),

('10000000-0000-0000-0000-000000000002',
'Rebranding Restaurante',
'Rediseño completo de identidad visual para cadena de restaurantes.',
'Sabores del Sur',
ARRAY['Branding', 'Restaurante', 'Diseño'],
NOW() - INTERVAL '15 days'),

('10000000-0000-0000-0000-000000000003',
'Campaña TV Nacional',
'Producción y difusión de campaña publicitaria en medios masivos.',
'Banco Nacional',
ARRAY['TV', 'Publicidad', 'Producción'],
NOW() - INTERVAL '30 days');

-- ================================================
-- 6. INSERT SAMPLE METRICS
-- ================================================

INSERT INTO agency_metrics_daily (day, agency_id, views, unique_visitors, profile_clicks, contact_clicks, website_clicks, leads) VALUES
-- Last 30 days for Impulso Digital
('2025-11-13', '10000000-0000-0000-0000-000000000001', 45, 38, 12, 5, 8, 3),
('2025-11-12', '10000000-0000-0000-0000-000000000001', 52, 41, 15, 6, 9, 4),
('2025-11-11', '10000000-0000-0000-0000-000000000001', 38, 32, 10, 4, 7, 2),
('2025-11-10', '10000000-0000-0000-0000-000000000001', 61, 48, 18, 7, 11, 5),

-- Last 30 days for Creativa Studio
('2025-11-13', '10000000-0000-0000-0000-000000000002', 28, 24, 8, 3, 5, 2),
('2025-11-12', '10000000-0000-0000-0000-000000000002', 32, 27, 9, 4, 6, 2),
('2025-11-11', '10000000-0000-0000-0000-000000000002', 25, 21, 7, 2, 4, 1),

-- Last 30 days for AdWorks Chile
('2025-11-13', '10000000-0000-0000-0000-000000000003', 55, 44, 16, 8, 10, 6),
('2025-11-12', '10000000-0000-0000-0000-000000000003', 48, 39, 14, 6, 9, 4);

-- ================================================
-- 7. INSERT SAMPLE AGENCY CONTACTS
-- ================================================

INSERT INTO agency_contacts (client_user_id, agency_id, contact_method, message, business_name, budget_range, created_at) VALUES
('00000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001',
'Formulario', 'Necesitamos ayuda con marketing digital para nuestro e-commerce.',
'Mi Tienda Online', 'high', NOW() - INTERVAL '5 days'),

('00000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000002',
'Email', 'Queremos rediseñar nuestra marca.',
'Empresa XYZ', 'medium', NOW() - INTERVAL '3 days'),

('00000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000003',
'Teléfono', 'Interesados en una campaña publicitaria.',
'Startup ABC', 'high', NOW() - INTERVAL '1 day');

-- ================================================
-- 8. INSERT SAMPLE CLIENT PROFILES
-- ================================================

INSERT INTO client_profiles (user_id, business_name, business_instagram, budget_range, desired_categories, about_business) VALUES
('00000000-0000-0000-0000-000000000006',
'Mi Tienda Online', '@mitiendaonline', 'high',
ARRAY['Marketing', 'Digital'],
'E-commerce de productos artesanales chilenos buscando crecer en mercado nacional.'),

('00000000-0000-0000-0000-000000000007',
'Empresa XYZ', '@empresaxyz', 'medium',
ARRAY['Branding', 'Diseño'],
'Empresa de servicios profesionales buscando renovar imagen corporativa.');

-- ================================================
-- 9. REFRESH MATERIALIZED VIEW
-- ================================================

REFRESH MATERIALIZED VIEW agency_analytics_summary;

-- ================================================
-- SAMPLE DATA COMPLETE!
-- ================================================
-- Your production database now has:
-- - 8 users (1 admin, 4 agency owners, 3 clients)
-- - 5 agencies (4 approved, 1 pending)
-- - 7 reviews (6 approved, 1 pending)
-- - 4 portfolio items
-- - Sample metrics and contacts
-- - 2 client profiles
