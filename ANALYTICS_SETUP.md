# Configuración del Sistema de Analytics de Vitria

## ✅ Completado

1. **Backend de Analytics**
   - Router tRPC con endpoints seguros (`server/routers/analytics.ts`)
   - Cliente admin de Supabase para operaciones privilegiadas
   - Hooks de tracking para frontend (`hooks/useTracking.ts`)

2. **Dashboard de Admin**
   - KPIs en tiempo real (usuarios, agencias, búsquedas, contactos)
   - Gráficos interactivos con recharts
   - Ranking de agencias top 10
   - Exportación a CSV
   - Filtros por período (7, 30, 90 días)

3. **Seguridad**
   - Uso de `SUPABASE_SERVICE_ROLE` para operaciones backend
   - `protectedProcedure` requiere autenticación de admin
   - Tracking público sin exponer datos sensibles

## 🔧 Paso Final Requerido

Para que el sistema de analytics funcione correctamente, debes ejecutar las funciones SQL en tu base de datos de Supabase:

### Instrucciones:

1. Ve a tu proyecto en [supabase.com](https://supabase.com)
2. Entra a **SQL Editor**
3. Crea un nuevo query
4. Copia y pega el contenido del archivo `database/analytics_functions.sql`
5. Haz click en **Run** para ejecutar

Esto creará:
- Función `get_agency_view_stats()` - Agrega vistas por agencia
- Función `get_agency_contact_stats()` - Agrega contactos por agencia
- Índices para mejorar performance de las consultas

## 📊 Cómo Usar el Sistema

### Para Admins:

1. **Dashboard Principal** (`/admin`)
   - Vista general de métricas del marketplace
   - KPIs de crecimiento (nuevos usuarios, agencias)
   - Resumen de analytics últimos 30 días

2. **Analytics Completo** (`/admin/analytics`)
   - Gráficos de vistas y contactos por agencia
   - Tabla de ranking top 10
   - Exportar datos a CSV
   - Filtrar por período (7, 30, 90 días)

### Tracking Automático:

El sistema ya está configurado para trackear automáticamente:
- ✅ Vistas de perfil de agencia
- ✅ Clicks en teléfono/email/website
- ✅ Envíos de formularios de contacto
- ✅ Búsquedas y apariciones en resultados

## 🎯 Objetivo del Analytics

Este sistema te permite demostrar **valor real** a las agencias y vender membresías premium mostrándoles:

1. **Cuántas personas vieron su perfil**
2. **Cuántos leads recibieron gracias a Vitria**
3. **Qué búsquedas los trajeron a ellos**
4. **Cómo se comparan con la competencia**

## 🔒 Políticas de Seguridad (RLS)

Las tablas de analytics necesitan las siguientes políticas RLS en Supabase:

```sql
-- Permitir inserts públicos para tracking (ya usa service role, pero por si acaso)
CREATE POLICY "Allow public insert on interaction_logs"
ON interaction_logs FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow public insert on search_analytics"
ON search_analytics FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Solo admins pueden leer analytics
CREATE POLICY "Only admins can read interaction_logs"
ON interaction_logs FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND users.role = 'admin'
  )
);

CREATE POLICY "Only admins can read search_analytics"
ON search_analytics FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.auth_id = auth.uid()
    AND users.role = 'admin'
  )
);
```

## 📈 Próximos Pasos Recomendados

1. **Implementar tabla `agency_metrics_daily`** 
   - Pre-agregar métricas diarias para mejorar performance
   - Ejecutar job nocturno que consolide datos

2. **Dashboard por Agencia**
   - Crear vista `/dashboard/analytics` para dueños de agencias
   - Mostrar sus propias métricas (sin comparación)

3. **Reportes Automatizados**
   - Enviar email mensual a agencias premium
   - Mostrar leads generados ese mes

4. **A/B Testing**
   - Trackear qué posiciones en búsqueda generan más clicks
   - Optimizar algoritmo de ranking
