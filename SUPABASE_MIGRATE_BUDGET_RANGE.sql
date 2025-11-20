-- ============================================================
-- MIGRACIÓN: Actualizar valores de budget_range
-- ============================================================
-- Este script migra los datos existentes de presupuesto
-- de valores simbólicos ($, $$, $$$) a valores monetarios
-- 
-- EJECUTAR EN: Supabase Cloud SQL Editor
-- ============================================================

-- 1. Ver datos existentes (para verificar)
SELECT budget_range, COUNT(*) 
FROM client_profiles 
GROUP BY budget_range;

-- 2. Eliminar la restricción CHECK antigua temporalmente
ALTER TABLE client_profiles 
DROP CONSTRAINT IF EXISTS client_profiles_budget_range_check;

-- 3. Migrar datos existentes a nuevos valores
UPDATE client_profiles
SET budget_range = CASE 
  WHEN budget_range = '$' THEN 'Menos de 1M'
  WHEN budget_range = '$$' THEN '1-3M'
  WHEN budget_range = '$$$' THEN '3-5M'
  ELSE budget_range
END
WHERE budget_range IN ('$', '$$', '$$$');

-- 4. Crear nueva restricción CHECK con valores actualizados
ALTER TABLE client_profiles
ADD CONSTRAINT client_profiles_budget_range_check 
CHECK (budget_range IN ('Menos de 1M', '1-3M', '3-5M', '5M+'));

-- 5. Verificar que todo funcionó correctamente
SELECT budget_range, COUNT(*) 
FROM client_profiles 
GROUP BY budget_range;
