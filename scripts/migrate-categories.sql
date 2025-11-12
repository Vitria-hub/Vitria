-- Migration Script: Convert old 'services' to new 'categories'
-- This script maps legacy services to the new simplified category system
-- Run this in your Supabase production database SQL editor

-- Step 1: Add categories based on existing services
-- Map each service to its corresponding main category

UPDATE agencies
SET categories = ARRAY[]::text[]
WHERE categories IS NULL OR categories = '{}';

-- Publicidad Digital (publicidad-digital)
UPDATE agencies
SET categories = array_append(categories, 'publicidad-digital')
WHERE (
   'Marketing Digital' = ANY(services)
   OR 'Google Ads' = ANY(services)
   OR 'Meta Ads' = ANY(services)
   OR 'Facebook Ads' = ANY(services)
   OR 'Instagram Ads' = ANY(services)
   OR 'TikTok Ads' = ANY(services)
   OR 'LinkedIn Ads' = ANY(services)
   OR 'Publicidad Programática' = ANY(services)
   OR 'Twitter Ads' = ANY(services)
   OR 'Amazon Ads' = ANY(services)
)
AND NOT ('publicidad-digital' = ANY(categories));

-- Branding e Identidad (branding-identidad)
UPDATE agencies
SET categories = array_append(categories, 'branding-identidad')
WHERE (
   'Branding' = ANY(services)
   OR 'Diseño de Logo' = ANY(services)
   OR 'Identidad Corporativa' = ANY(services)
   OR 'Naming' = ANY(services)
   OR 'Manual de Marca' = ANY(services)
   OR 'Rebranding' = ANY(services)
   OR 'Packaging' = ANY(services)
   OR 'Diseño Editorial' = ANY(services)
)
AND NOT ('branding-identidad' = ANY(categories));

-- Desarrollo Web (desarrollo-web)
UPDATE agencies
SET categories = array_append(categories, 'desarrollo-web')
WHERE (
   'Desarrollo Web' = ANY(services)
   OR 'E-commerce' = ANY(services)
   OR 'Apps Móviles' = ANY(services)
   OR 'Landing Pages' = ANY(services)
   OR 'Sitio Web Corporativo' = ANY(services)
   OR 'WordPress' = ANY(services)
   OR 'Shopify' = ANY(services)
   OR 'WooCommerce' = ANY(services)
   OR 'SaaS' = ANY(services)
)
AND NOT ('desarrollo-web' = ANY(categories));

-- Contenido y Redes (contenido-redes)
UPDATE agencies
SET categories = array_append(categories, 'contenido-redes')
WHERE (
   'Redes Sociales' = ANY(services)
   OR 'Community Management' = ANY(services)
   OR 'Gestión RRSS' = ANY(services)
   OR 'Content Marketing' = ANY(services)
   OR 'Copywriting' = ANY(services)
   OR 'Creación de Contenido' = ANY(services)
   OR 'Influencers' = ANY(services)
   OR 'Marketing de Influencers' = ANY(services)
)
AND NOT ('contenido-redes' = ANY(categories));

-- Video y Fotografía (video-fotografia)
UPDATE agencies
SET categories = array_append(categories, 'video-fotografia')
WHERE (
   'Producción Audiovisual' = ANY(services)
   OR 'Video Corporativo' = ANY(services)
   OR 'Fotografía' = ANY(services)
   OR 'Fotografía Profesional' = ANY(services)
   OR 'Fotografía de Producto' = ANY(services)
   OR 'Motion Graphics' = ANY(services)
   OR 'Animación' = ANY(services)
   OR 'Edición de Video' = ANY(services)
)
AND NOT ('video-fotografia' = ANY(categories));

-- Estrategia y Consultoría (estrategia-consultoria)
UPDATE agencies
SET categories = array_append(categories, 'estrategia-consultoria')
WHERE (
   'Consultoría' = ANY(services)
   OR 'Estrategia Digital' = ANY(services)
   OR 'Performance Marketing' = ANY(services)
   OR 'Growth Marketing' = ANY(services)
   OR 'Analytics' = ANY(services)
   OR 'Marketing Automation' = ANY(services)
   OR 'CRO' = ANY(services)
   OR 'Optimización de Conversión' = ANY(services)
)
AND NOT ('estrategia-consultoria' = ANY(categories));

-- Relaciones Públicas (relaciones-publicas)
UPDATE agencies
SET categories = array_append(categories, 'relaciones-publicas')
WHERE (
   'Relaciones Públicas' = ANY(services)
   OR 'RRPP' = ANY(services)
   OR 'Comunicación Corporativa' = ANY(services)
   OR 'Gestión de Crisis' = ANY(services)
   OR 'Eventos' = ANY(services)
   OR 'Organización de Eventos' = ANY(services)
   OR 'Prensa y Medios' = ANY(services)
   OR 'Media Training' = ANY(services)
)
AND NOT ('relaciones-publicas' = ANY(categories));

-- Diseño Gráfico (diseno-grafico)
UPDATE agencies
SET categories = array_append(categories, 'diseno-grafico')
WHERE (
   'Diseño Gráfico' = ANY(services)
   OR 'Material POP' = ANY(services)
   OR 'Diseño de Presentaciones' = ANY(services)
   OR 'Infografías' = ANY(services)
   OR 'Ilustración' = ANY(services)
   OR 'Merchandising' = ANY(services)
   OR 'Diseño para Redes Sociales' = ANY(services)
)
AND NOT ('diseno-grafico' = ANY(categories));

-- Remove duplicates from categories array
UPDATE agencies
SET categories = (
  SELECT ARRAY(SELECT DISTINCT unnest(categories) ORDER BY 1)
);

-- Verification: Check how many agencies were updated
SELECT 
  COUNT(*) as total_agencies,
  COUNT(*) FILTER (WHERE categories IS NOT NULL AND array_length(categories, 1) > 0) as agencies_with_categories,
  COUNT(*) FILTER (WHERE categories IS NULL OR array_length(categories, 1) = 0) as agencies_without_categories
FROM agencies;

-- Show sample results
SELECT name, services, categories
FROM agencies
LIMIT 10;
