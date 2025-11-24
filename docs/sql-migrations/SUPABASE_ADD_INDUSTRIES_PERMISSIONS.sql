-- ================================================
-- AGREGAR COLUMNA industries Y PERMISOS
-- ================================================
-- INSTRUCCIONES:
-- 1. Ve a https://supabase.com/dashboard
-- 2. Abre tu proyecto Vitria
-- 3. Ve a SQL Editor (ícono de database en el menú izquierdo)
-- 4. Copia y pega TODO este archivo
-- 5. Haz click en "Run" (▶️)
-- 6. Espera 30 segundos
-- 7. Ve a Settings → API → Click "Reload schema"
-- 8. ¡Listo! Ahora prueba guardar industrias en el admin panel
-- ================================================

-- PASO 1: Crear la columna industries (si no existe)
ALTER TABLE public.agencies 
ADD COLUMN IF NOT EXISTS industries TEXT[] DEFAULT '{}';

-- PASO 2: Dar permisos de lectura y escritura a todos los roles de Supabase
GRANT SELECT (industries) ON TABLE public.agencies TO anon;
GRANT SELECT (industries) ON TABLE public.agencies TO authenticated;
GRANT SELECT (industries) ON TABLE public.agencies TO service_role;

GRANT INSERT (industries) ON TABLE public.agencies TO anon;
GRANT INSERT (industries) ON TABLE public.agencies TO authenticated;
GRANT INSERT (industries) ON TABLE public.agencies TO service_role;

GRANT UPDATE (industries) ON TABLE public.agencies TO anon;
GRANT UPDATE (industries) ON TABLE public.agencies TO authenticated;
GRANT UPDATE (industries) ON TABLE public.agencies TO service_role;

-- PASO 3: Forzar refresh del cache de PostgREST
NOTIFY pgrst, 'reload schema';

-- PASO 4: Verificar que todo funcionó
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'agencies' 
  AND column_name = 'industries';

-- ✅ Debe mostrar: industries | ARRAY | '{}'::text[]

-- PASO 5: Verificar permisos
SELECT grantee, privilege_type, column_name
FROM information_schema.column_privileges
WHERE table_name = 'agencies' 
  AND column_name = 'industries'
ORDER BY grantee, privilege_type;

-- ✅ Debe mostrar filas con anon, authenticated, service_role
-- 
-- PASO FINAL: Ve a Settings → API → "Reload schema" en el dashboard de Supabase
