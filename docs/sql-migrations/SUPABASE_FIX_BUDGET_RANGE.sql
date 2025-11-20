-- ============================================================
-- FIX: Actualizar restricción CHECK de budget_range
-- ============================================================
-- Este script actualiza la restricción CHECK de la tabla
-- client_profiles para aceptar los nuevos valores de presupuesto
-- 
-- EJECUTAR EN: Supabase Cloud SQL Editor
-- ============================================================

-- 1. Eliminar la restricción CHECK antigua
ALTER TABLE client_profiles 
DROP CONSTRAINT IF EXISTS client_profiles_budget_range_check;

-- 2. Crear nueva restricción CHECK con valores actualizados
ALTER TABLE client_profiles
ADD CONSTRAINT client_profiles_budget_range_check 
CHECK (budget_range IN ('Menos de 1M', '1-3M', '3-5M', '5M+'));

-- 3. Verificar que la restricción fue creada correctamente
SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'client_profiles'::regclass
  AND conname = 'client_profiles_budget_range_check';
