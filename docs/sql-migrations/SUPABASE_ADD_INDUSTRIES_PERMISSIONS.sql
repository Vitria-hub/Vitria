-- ================================================
-- AGREGAR PERMISOS PARA COLUMNA industries
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

-- Verificar que la columna existe (debe devolver 1 fila)
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'agencies' 
  AND column_name = 'industries';

-- Dar permisos de lectura y escritura a todos los roles de Supabase
GRANT SELECT (industries) ON TABLE public.agencies TO anon;
GRANT SELECT (industries) ON TABLE public.agencies TO authenticated;
GRANT SELECT (industries) ON TABLE public.agencies TO service_role;

GRANT INSERT (industries) ON TABLE public.agencies TO anon;
GRANT INSERT (industries) ON TABLE public.agencies TO authenticated;
GRANT INSERT (industries) ON TABLE public.agencies TO service_role;

GRANT UPDATE (industries) ON TABLE public.agencies TO anon;
GRANT UPDATE (industries) ON TABLE public.agencies TO authenticated;
GRANT UPDATE (industries) ON TABLE public.agencies TO service_role;

-- Forzar refresh del cache de PostgREST
NOTIFY pgrst, 'reload schema';

-- Verificar permisos (debe mostrar varias filas con grantee = anon, authenticated, service_role)
SELECT grantee, privilege_type, column_name
FROM information_schema.column_privileges
WHERE table_name = 'agencies' 
  AND column_name = 'industries'
ORDER BY grantee, privilege_type;

-- ✅ Si ves filas con anon, authenticated, service_role → ¡Funcionó!
-- Ahora ve a Settings → API → "Reload schema" en el dashboard
