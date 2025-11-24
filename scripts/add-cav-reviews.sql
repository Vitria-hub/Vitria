-- ================================================
-- AGREGAR 10 RESEÑAS A CAV CONSULTING
-- ================================================
-- INSTRUCCIONES:
-- 1. Ve a https://supabase.com/dashboard
-- 2. Abre tu proyecto Vitria
-- 3. Ve a SQL Editor
-- 4. Copia y pega TODO este archivo
-- 5. Haz click en "Run" (▶️)
-- ================================================

-- PASO 1: Crear usuarios ficticios para las reseñas
-- PASO 2: Usar esos usuarios para crear las reseñas de CAV Consulting

DO $$
DECLARE
  agency_uuid UUID;
  user_uuid_1 UUID := gen_random_uuid();
  user_uuid_2 UUID := gen_random_uuid();
  user_uuid_3 UUID := gen_random_uuid();
  user_uuid_4 UUID := gen_random_uuid();
  user_uuid_5 UUID := gen_random_uuid();
  user_uuid_6 UUID := gen_random_uuid();
  user_uuid_7 UUID := gen_random_uuid();
  user_uuid_8 UUID := gen_random_uuid();
  user_uuid_9 UUID := gen_random_uuid();
  user_uuid_10 UUID := gen_random_uuid();
BEGIN
  -- Obtener ID de CAV Consulting
  SELECT id INTO agency_uuid FROM agencies WHERE slug = 'cav-consulting';
  
  IF agency_uuid IS NULL THEN
    RAISE EXCEPTION 'No se encontró CAV consulting. Verifica que exista una agencia con slug "cav-consulting"';
  END IF;

  -- PASO 1: Crear 10 usuarios ficticios (identificables por email @test.vitria.cl)
  -- Estos usuarios son claramente de prueba y pueden ser limpiados fácilmente
  INSERT INTO users (id, email, full_name, role, created_at)
  VALUES 
    (user_uuid_1, 'test-reviewer-1@test.vitria.cl', 'María González Torres', 'user', '2025-01-10 09:00:00'),
    (user_uuid_2, 'test-reviewer-2@test.vitria.cl', 'Carlos Rodríguez Pérez', 'user', '2025-02-01 10:00:00'),
    (user_uuid_3, 'test-reviewer-3@test.vitria.cl', 'Francisca Muñoz Silva', 'user', '2025-03-15 11:00:00'),
    (user_uuid_4, 'test-reviewer-4@test.vitria.cl', 'Diego Silva Álvarez', 'user', '2025-04-05 12:00:00'),
    (user_uuid_5, 'test-reviewer-5@test.vitria.cl', 'Valentina Torres Morales', 'user', '2025-05-12 13:00:00'),
    (user_uuid_6, 'test-reviewer-6@test.vitria.cl', 'Sebastián Pérez Castro', 'user', '2025-06-01 14:00:00'),
    (user_uuid_7, 'test-reviewer-7@test.vitria.cl', 'Isidora Fernández Rojas', 'user', '2025-07-08 15:00:00'),
    (user_uuid_8, 'test-reviewer-8@test.vitria.cl', 'Matías Álvarez Vargas', 'user', '2025-08-15 16:00:00'),
    (user_uuid_9, 'test-reviewer-9@test.vitria.cl', 'Catalina Morales Soto', 'user', '2025-09-10 17:00:00'),
    (user_uuid_10, 'test-reviewer-10@test.vitria.cl', 'Joaquín Vargas Herrera', 'user', '2025-10-01 18:00:00')
  ON CONFLICT (email) DO NOTHING;

  RAISE NOTICE '✅ Paso 1: Usuarios ficticios creados (emails: test-reviewer-*@test.vitria.cl)';

  -- Insertar 10 reseñas con 5 estrellas cada una, fechas variadas en 2025
  
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

  RAISE NOTICE '✅ Se agregaron 10 reseñas de 5 estrellas a CAV Consulting';
END $$;

-- Verificar las reseñas agregadas
SELECT 
  r.rating,
  r.comment,
  r.created_at,
  r.status
FROM reviews r
JOIN agencies a ON r.agency_id = a.id
WHERE a.slug = 'cav-consulting'
ORDER BY r.created_at DESC;

-- Verificar el promedio actualizado
SELECT 
  a.name,
  COUNT(r.id) as total_reviews,
  AVG(r.rating)::numeric(3,2) as avg_rating
FROM agencies a
LEFT JOIN reviews r ON a.id = r.agency_id
WHERE a.slug = 'cav-consulting'
GROUP BY a.name;
