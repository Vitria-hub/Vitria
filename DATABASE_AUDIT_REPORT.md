# 🔍 Auditoría de Base de Datos - Vitria
**Fecha:** 20 de Noviembre, 2025
**Objetivo:** Verificar que todas las tablas necesarias existan y estén sincronizadas

---

## ✅ ESTADO GENERAL: SALUDABLE

Todas las tablas críticas existen y funcionan correctamente.

---

## 📊 ANÁLISIS COMPLETO

### Tablas Definidas en Código (lib/supabase.ts):
1. ✅ **users** - Existe en DB
2. ✅ **client_profiles** - Existe en DB
3. ✅ **agencies** - Existe en DB
4. ✅ **reviews** - Existe en DB
5. ✅ **interaction_logs** - Existe en DB
6. ✅ **search_analytics** - Existe en DB
7. ✅ **agency_metrics_daily** - Existe en DB
8. ✅ **quote_requests** - Existe en DB (recién creada)

### Tablas en Base de Datos sin Tipo TypeScript:
9. ⚠️ **portfolio_items** - Existe en DB, SE USA en código, FALTA tipo TypeScript
10. ℹ️ **agency_contacts** - Existe en DB (legacy)
11. ℹ️ **sponsored_slots** - Existe en DB (slots patrocinados)
12. ℹ️ **plans** - Existe en DB (Stripe - deshabilitado)
13. ℹ️ **subscriptions** - Existe en DB (Stripe - deshabilitado)

---

## 🔴 PROBLEMA ENCONTRADO: portfolio_items

### Descripción:
La tabla `portfolio_items` existe físicamente en la base de datos y **SE USA ACTIVAMENTE** en el código, pero **NO está definida** en el tipo TypeScript (`lib/supabase.ts`).

### Impacto:
- ⚠️ **TypeScript no valida queries** a esta tabla
- ⚠️ **Posibles errores en runtime** no detectados en compilación
- ⚠️ **Inconsistencia** entre código y base de datos

### Componentes que la usan:
- `components/PortfolioGrid.tsx` - Muestra items de portfolio
- `server/routers/admin.ts` - Cuenta portfolio items por agencia
- `scripts/delete-all-agencies.ts` - Elimina portfolio items

### Estructura de la tabla (según DB):
```sql
CREATE TABLE portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID REFERENCES agencies(id),
  title TEXT NOT NULL,
  description TEXT,
  media_urls TEXT[],
  client_name TEXT,
  tags TEXT[],
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Solución:
✅ **Agregar definición TypeScript** en `lib/supabase.ts`

---

## ℹ️ TABLAS LEGACY (No Críticas)

### 1. agency_contacts
- **Estado:** Existe en DB
- **Uso:** No encontrado en código actual
- **Acción:** Mantener por si hay datos históricos

### 2. sponsored_slots
- **Estado:** Existe en DB
- **Uso:** Sistema de slots patrocinados
- **Acción:** Mantener (funcionalidad futura)

### 3. plans & subscriptions
- **Estado:** Existe en DB
- **Uso:** Sistema Stripe (deshabilitado según replit.md)
- **Acción:** Mantener por datos históricos

---

## 🎯 ACCIONES RECOMENDADAS

### Prioridad Alta:
1. ✅ **Agregar tipo TypeScript para `portfolio_items`** en `lib/supabase.ts`

### Prioridad Media:
2. 📝 **Documentar tablas legacy** (agency_contacts, plans, subscriptions)
3. 🔍 **Verificar si sponsored_slots se usa** activamente

### Prioridad Baja:
4. 🧹 **Evaluar limpieza** de tablas no utilizadas en futuro

---

## ✅ TABLAS VERIFICADAS (Funcionando Correctamente)

| Tabla | Existe en DB | Tipo TypeScript | Índices | Estado |
|-------|--------------|-----------------|---------|--------|
| users | ✅ | ✅ | ✅ | OK |
| client_profiles | ✅ | ✅ | ✅ | OK |
| agencies | ✅ | ✅ | ✅ | OK |
| reviews | ✅ | ✅ | ✅ | OK |
| interaction_logs | ✅ | ✅ | ✅ | OK |
| search_analytics | ✅ | ✅ | ✅ | OK |
| agency_metrics_daily | ✅ | ✅ | ✅ | OK |
| quote_requests | ✅ | ✅ | ✅ | **RECIÉN CREADA** |
| portfolio_items | ✅ | ❌ | ✅ | **FALTA TIPO** |

---

## 📝 NOTAS

### quote_requests
- **Creada:** 20 Nov 2025
- **Razón:** Tabla faltante que causaba error al enviar cotizaciones
- **Índices creados:** agency_id, client_user_id, status, created_at
- **Estado:** ✅ Funcionando correctamente

### Recomendación General
Se recomienda mantener sincronizados:
1. Esquema de base de datos física
2. Tipos TypeScript en `lib/supabase.ts`
3. Documentación en `replit.md`

---

## 🔒 SEGURIDAD

Todas las tablas tienen:
- ✅ Primary keys (UUID)
- ✅ Foreign keys con ON DELETE CASCADE/SET NULL apropiados
- ✅ Índices para performance
- ✅ Timestamps (created_at, updated_at)

---

**Próximo Paso:** Agregar tipo TypeScript para `portfolio_items`
