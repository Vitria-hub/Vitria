-- Script para actualizar las categorías de Scale Lab
-- Ejecutar en Supabase SQL Editor

-- Primero, vamos a ver qué categorías tiene actualmente Scale Lab
SELECT id, name, categories FROM agencies WHERE name = 'Scale Lab';

-- Luego, actualizamos las categorías para que incluya 'performance-ads'
-- Esto permitirá que aparezca cuando filtres por "Performance & Ads"
UPDATE agencies 
SET categories = ARRAY['performance-ads', 'social-media', 'desarrollo-web']::text[]
WHERE name = 'Scale Lab';

-- Verificar que se actualizó correctamente
SELECT id, name, categories FROM agencies WHERE name = 'Scale Lab';
