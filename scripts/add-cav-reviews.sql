-- ================================================
-- LIMPIAR Y AGREGAR RESEÑAS A CAV CONSULTING
-- ================================================
-- Este script:
-- 1. Elimina TODAS las reseñas existentes de CAV Consulting
-- 2. Crea 10 usuarios ficticios con nombres normales
-- 3. Agrega 10 reseñas de 5 estrellas
-- 
-- Los usuarios ficticios usan UUIDs específicos para identificación interna
-- pero se ven como usuarios normales en el frontend
-- ================================================

DO $$
DECLARE
  agency_uuid UUID;
  -- UUIDs fijos para usuarios ficticios (identificables en BD pero invisibles en frontend)
  user_uuid_1 UUID := '00000000-0000-0000-0001-000000000001'::uuid;
  user_uuid_2 UUID := '00000000-0000-0000-0001-000000000002'::uuid;
  user_uuid_3 UUID := '00000000-0000-0000-0001-000000000003'::uuid;
  user_uuid_4 UUID := '00000000-0000-0000-0001-000000000004'::uuid;
  user_uuid_5 UUID := '00000000-0000-0000-0001-000000000005'::uuid;
  user_uuid_6 UUID := '00000000-0000-0000-0001-000000000006'::uuid;
  user_uuid_7 UUID := '00000000-0000-0000-0001-000000000007'::uuid;
  user_uuid_8 UUID := '00000000-0000-0000-0001-000000000008'::uuid;
  user_uuid_9 UUID := '00000000-0000-0000-0001-000000000009'::uuid;
  user_uuid_10 UUID := '00000000-0000-0000-0001-000000000010'::uuid;
BEGIN
  -- Obtener ID de CAV Consulting
  SELECT id INTO agency_uuid FROM agencies WHERE slug = 'cav-consulting';
  
  IF agency_uuid IS NULL THEN
    RAISE EXCEPTION 'No se encontró CAV consulting. Verifica que exista una agencia con slug "cav-consulting"';
  END IF;

  -- PASO 1: Eliminar TODAS las reseñas existentes de CAV Consulting
  DELETE FROM reviews WHERE agency_id = agency_uuid;
  RAISE NOTICE '✅ Paso 1: Eliminadas todas las reseñas existentes de CAV Consulting';

  -- PASO 2: Crear 10 usuarios ficticios (nombres normales, UUIDs específicos para identificación interna)
  -- NOTA: Para identificar estos usuarios en BD, buscar por: WHERE id LIKE '00000000-0000-0000-0001-%'
  INSERT INTO users (id, auth_id, full_name, role, created_at)
  VALUES 
    (user_uuid_1, user_uuid_1, 'María González', 'user', '2025-01-10 09:00:00'),
    (user_uuid_2, user_uuid_2, 'Carlos Rodríguez', 'user', '2025-02-01 10:00:00'),
    (user_uuid_3, user_uuid_3, 'Francisca Muñoz', 'user', '2025-03-15 11:00:00'),
    (user_uuid_4, user_uuid_4, 'Diego Silva', 'user', '2025-04-05 12:00:00'),
    (user_uuid_5, user_uuid_5, 'Valentina Torres', 'user', '2025-05-12 13:00:00'),
    (user_uuid_6, user_uuid_6, 'Sebastián Pérez', 'user', '2025-06-01 14:00:00'),
    (user_uuid_7, user_uuid_7, 'Isidora Fernández', 'user', '2025-07-08 15:00:00'),
    (user_uuid_8, user_uuid_8, 'Matías Álvarez', 'user', '2025-08-15 16:00:00'),
    (user_uuid_9, user_uuid_9, 'Catalina Morales', 'user', '2025-09-10 17:00:00'),
    (user_uuid_10, user_uuid_10, 'Joaquín Vargas', 'user', '2025-10-01 18:00:00')
  ON CONFLICT (id) DO NOTHING;

  RAISE NOTICE '✅ Paso 2: Usuarios ficticios creados (se ven normales en frontend)';

  -- PASO 3: Crear 10 reseñas de 5 estrellas para CAV Consulting
  
  -- Reseña 1 - Enero 2025
  INSERT INTO reviews (id, agency_id, user_id, rating, comment, created_at, status)
  VALUES (
    gen_random_uuid(),
    agency_uuid,
    user_uuid_1,
    5,
    'Excelente trabajo! CAV nos ayudó a rediseñar nuestra estrategia digital y los resultados fueron increíbles. En 3 meses aumentamos nuestras conversiones en un 45%. Súper recomendados!',
    '2025-01-15 10:30:00',
    'approved'
  );

  -- Reseña 2 - Febrero 2025
  INSERT INTO reviews (id, agency_id, user_id, rating, comment, created_at, status)
  VALUES (
    gen_random_uuid(),
    agency_uuid,
    user_uuid_2,
    5,
    'Profesionales de primera! Trabajamos con CAV en una campaña de Google Ads y superaron nuestras expectativas. El ROI fue excepcional y la comunicación siempre fue clara y transparente.',
    '2025-02-08 14:20:00',
    'approved'
  );

  -- Reseña 3 - Marzo 2025
  INSERT INTO reviews (id, agency_id, user_id, rating, comment, created_at, status)
  VALUES (
    gen_random_uuid(),
    agency_uuid,
    user_uuid_3,
    5,
    'CAV Consulting transformó nuestra presencia en redes sociales. Pasamos de tener apenas interacción a construir una comunidad activa. Su equipo es muy creativo y entiende perfecto el mercado chileno.',
    '2025-03-22 16:45:00',
    'approved'
  );

  -- Reseña 4 - Abril 2025
  INSERT INTO reviews (id, agency_id, user_id, rating, comment, created_at, status)
  VALUES (
    gen_random_uuid(),
    agency_uuid,
    user_uuid_4,
    5,
    'La mejor inversión que hemos hecho en marketing digital. CAV nos entregó un plan estratégico súper completo y nos acompañaron en toda la implementación. Los resultados hablan por sí solos.',
    '2025-04-10 09:15:00',
    'approved'
  );

  -- Reseña 5 - Mayo 2025
  INSERT INTO reviews (id, agency_id, user_id, rating, comment, created_at, status)
  VALUES (
    gen_random_uuid(),
    agency_uuid,
    user_uuid_5,
    5,
    'Trabajar con CAV fue una experiencia excelente de principio a fin. Son muy profesionales, cumplen con los plazos y siempre están disponibles para resolver dudas. 100% recomendados!',
    '2025-05-18 11:00:00',
    'approved'
  );

  -- Reseña 6 - Junio 2025
  INSERT INTO reviews (id, agency_id, user_id, rating, comment, created_at, status)
  VALUES (
    gen_random_uuid(),
    agency_uuid,
    user_uuid_6,
    5,
    'Contratamos a CAV para mejorar nuestra performance en Meta Ads y YouTube. En solo 2 meses duplicamos nuestros leads y el costo por adquisición bajó un 30%. Muy contentos con los resultados!',
    '2025-06-05 13:30:00',
    'approved'
  );

  -- Reseña 7 - Julio 2025
  INSERT INTO reviews (id, agency_id, user_id, rating, comment, created_at, status)
  VALUES (
    gen_random_uuid(),
    agency_uuid,
    user_uuid_7,
    5,
    'Equipo muy profesional y dedicado. CAV nos ayudó a optimizar toda nuestra estrategia digital y los cambios se notaron rápidamente. Excelente servicio al cliente y muy buenos insights.',
    '2025-07-12 15:45:00',
    'approved'
  );

  -- Reseña 8 - Agosto 2025
  INSERT INTO reviews (id, agency_id, user_id, rating, comment, created_at, status)
  VALUES (
    gen_random_uuid(),
    agency_uuid,
    user_uuid_8,
    5,
    'CAV nos diseñó una campaña integral de marketing digital que superó todas nuestras metas. Su enfoque data-driven y creatividad los hace destacar. Definitivamente seguiremos trabajando con ellos!',
    '2025-08-20 10:00:00',
    'approved'
  );

  -- Reseña 9 - Septiembre 2025
  INSERT INTO reviews (id, agency_id, user_id, rating, comment, created_at, status)
  VALUES (
    gen_random_uuid(),
    agency_uuid,
    user_uuid_9,
    5,
    'Increíble trabajo! Nos ayudaron a relanzar nuestra marca en digital con una estrategia muy bien pensada. El equipo de CAV es super atento, responden rápido y siempre con soluciones efectivas.',
    '2025-09-14 12:20:00',
    'approved'
  );

  -- Reseña 10 - Octubre 2025
  INSERT INTO reviews (id, agency_id, user_id, rating, comment, created_at, status)
  VALUES (
    gen_random_uuid(),
    agency_uuid,
    user_uuid_10,
    5,
    'La agencia más profesional con la que hemos trabajado. CAV nos entregó resultados medibles desde el primer mes. Su experiencia en performance marketing es notable y el trato es excelente.',
    '2025-10-08 14:50:00',
    'approved'
  );

  RAISE NOTICE '✅ Paso 3: Agregadas 10 reseñas de 5 estrellas a CAV Consulting';
END $$;

-- Verificar las reseñas agregadas
SELECT 
  r.rating,
  u.full_name as autor,
  r.comment,
  r.created_at,
  r.status
FROM reviews r
JOIN users u ON r.user_id = u.id
JOIN agencies a ON r.agency_id = a.id
WHERE a.slug = 'cav-consulting'
ORDER BY r.created_at DESC;

-- Verificar el promedio y total
SELECT 
  a.name,
  COUNT(r.id) as total_reviews,
  AVG(r.rating)::numeric(3,2) as avg_rating
FROM agencies a
LEFT JOIN reviews r ON a.id = r.agency_id
WHERE a.slug = 'cav-consulting'
GROUP BY a.name;

-- NOTA IMPORTANTE:
-- Para limpiar estos datos de prueba en el futuro:
-- DELETE FROM users WHERE id::text LIKE '00000000-0000-0000-0001-%';
-- Esto eliminará los usuarios ficticios (y sus reseñas por CASCADE)
