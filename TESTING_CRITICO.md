# ⚡ Testing Crítico - Vitria (Versión Reducida)

## Tiempo estimado: 30-45 minutos

Este checklist cubre **solo los flujos más críticos** que necesitas probar manualmente.

---

## 🔴 PRIORIDAD MÁXIMA (Cambios Recientes)

### 1. Formulario de Cotización - Usuario Autenticado
**Tiempo: 3 minutos**

1. ⬜ Registrarte e iniciar sesión
2. ⬜ Ir a cualquier agencia y hacer click en "Solicitar Cotización Gratis"
3. ⬜ **VERIFICAR**: Nombre y email están pre-llenados automáticamente
4. ⬜ **VERIFICAR**: Campo WhatsApp está vacío (opcional)
5. ⬜ **VERIFICAR**: Selector de categoría muestra las 6 nuevas:
   - Performance & Ads
   - Social Media
   - Diseño y Branding
   - Desarrollo Web
   - Producción de Contenido
   - Relaciones Públicas
6. ⬜ Llenar proyecto y enviar
7. ⬜ **VERIFICAR**: Mensaje de éxito aparece
8. ⬜ Cerrar modal, volver a abrir
9. ⬜ **VERIFICAR**: Nombre y email siguen pre-llenados

**✅ PASÓ | ❌ FALLÓ**

---

### 2. Terminología "WhatsApp" (Muestreo)
**Tiempo: 5 minutos**

Verificar que diga "WhatsApp" (NO "Teléfono") en:

| Página | Qué verificar | Estado |
|--------|--------------|--------|
| Crear Agencia (Paso 1) | Campo dice "WhatsApp *" | ⬜ |
| Editar Perfil | Campo dice "WhatsApp *" | ⬜ |
| Mi Agencia > Analytics | Métrica dice "Clicks en WhatsApp" | ⬜ |
| FAQ | Menciona "WhatsApp" correctamente | ⬜ |

**✅ PASÓ | ❌ FALLÓ**

---

### 3. Categorías en Homepage
**Tiempo: 2 minutos**

1. ⬜ Ir a la homepage (sin login)
2. ⬜ **VERIFICAR**: Grid muestra exactamente 6 categorías en 3x2:
   - Fila 1: Performance & Ads, Social Media, Diseño y Branding
   - Fila 2: Desarrollo Web, Producción de Contenido, Relaciones Públicas
3. ⬜ **VERIFICAR**: Cada categoría muestra número de agencias
4. ⬜ Click en una categoría
5. ⬜ **VERIFICAR**: Redirige a /agencias con filtro aplicado
6. ⬜ **VERIFICAR**: Resultados corresponden a esa categoría

**✅ PASÓ | ❌ FALLÓ**

---

## 🟡 PRIORIDAD ALTA (Flujos Core)

### 4. Flujo Completo: Registro Cliente → Cotización
**Tiempo: 5 minutos**

1. ⬜ Cerrar sesión (si estás logueado)
2. ⬜ Click en "Registrarse"
3. ⬜ Registrarte con email nuevo (ej: `test-nov20@gmail.com`)
4. ⬜ **VERIFICAR**: Después de registro, redirige a completar perfil cliente
5. ⬜ Completar perfil cliente
6. ⬜ **VERIFICAR**: Rango de presupuesto tiene 4 opciones (Menos de 1M, 1-3M, 3-5M, 5M+)
7. ⬜ Ir a "Explorar Agencias"
8. ⬜ Buscar agencias por categoría
9. ⬜ Abrir perfil de una agencia
10. ⬜ Solicitar cotización
11. ⬜ **VERIFICAR**: Nombre y email ya están pre-llenados
12. ⬜ Enviar cotización
13. ⬜ **VERIFICAR**: Email de confirmación llega a tu inbox

**✅ PASÓ | ❌ FALLÓ**

---

### 5. Flujo Completo: Registro Agencia → Crear Perfil
**Tiempo: 8 minutos**

1. ⬜ Cerrar sesión
2. ⬜ Registrarse con email nuevo seleccionando **"Tipo: Agencia"**
3. ⬜ **VERIFICAR**: Redirige a wizard de crear agencia (3 pasos)

**Paso 1 - Información Básica:**
4. ⬜ **VERIFICAR**: Campo dice "WhatsApp *" (no "Teléfono")
5. ⬜ Llenar todos los campos requeridos
6. ⬜ **VERIFICAR**: No permite avanzar si falta WhatsApp
7. ⬜ Avanzar al Paso 2

**Paso 2 - Servicios:**
8. ⬜ **VERIFICAR**: Selector de categorías muestra las 6 nuevas
9. ⬜ Seleccionar al menos 1 categoría y servicios
10. ⬜ Avanzar al Paso 3

**Paso 3 - Detalles:**
11. ⬜ **VERIFICAR**: Rango de precios tiene 4 opciones (Menos de 1M, 1-3M, 3-5M, 5M+)
12. ⬜ Completar y enviar
13. ⬜ **VERIFICAR**: Redirige a dashboard
14. ⬜ **VERIFICAR**: Muestra mensaje "Agencia creada, pendiente de aprobación"
15. ⬜ **VERIFICAR**: Métricas muestran 0 (NO números falsos como 1,234)

**✅ PASÓ | ❌ FALLÓ**

---

### 6. Dashboard de Agencia (Métricas Reales)
**Tiempo: 2 minutos**

Con la agencia recién creada:

1. ⬜ **VERIFICAR**: Dashboard muestra:
   - Vistas del Perfil: 0
   - Clicks en WhatsApp: 0
   - Clicks en Email: 0
   - Cotizaciones Recibidas: 0
2. ⬜ **VERIFICAR**: Widget "Salud del Perfil" muestra porcentaje (ej: 65%)
3. ⬜ **VERIFICAR**: Widget indica qué falta completar

**✅ PASÓ | ❌ FALLÓ**

---

### 7. Flujo Admin: Aprobar Agencia
**Tiempo: 4 minutos**

1. ⬜ Iniciar sesión como admin
2. ⬜ Ir a /admin/agencias
3. ⬜ **VERIFICAR**: Aparece la agencia recién creada con estado "Pending"
4. ⬜ Click en la agencia para ver detalle
5. ⬜ **VERIFICAR**: Modal muestra campo "WhatsApp" (no "Teléfono")
6. ⬜ Click en "Aprobar"
7. ⬜ **VERIFICAR**: Estado cambia a "Approved"
8. ⬜ Cerrar sesión como admin
9. ⬜ Ir a /agencias (sin login)
10. ⬜ **VERIFICAR**: La agencia ahora aparece en el listado público

**✅ PASÓ | ❌ FALLÓ**

---

## 🟢 PRIORIDAD MEDIA (Funcionalidad General)

### 8. Búsqueda y Filtros
**Tiempo: 3 minutos**

1. ⬜ Ir a /agencias
2. ⬜ Filtrar por categoría (seleccionar una de las 6 nuevas)
3. ⬜ **VERIFICAR**: Resultados corresponden a esa categoría
4. ⬜ Filtrar por región
5. ⬜ **VERIFICAR**: Resultados corresponden a esa región
6. ⬜ Filtrar por rango de precios (incluye "Menos de 1M")
7. ⬜ **VERIFICAR**: Resultados se actualizan

**✅ PASÓ | ❌ FALLÓ**

---

### 9. Agencia Premium vs No Premium
**Tiempo: 3 minutos**

**Agencia Premium:**
1. ⬜ Buscar una agencia premium (tiene badge "Premium")
2. ⬜ Abrir perfil
3. ⬜ **VERIFICAR**: Aparece botón "Ver más formas de contacto"
4. ⬜ Click en el botón
5. ⬜ **VERIFICAR**: Muestra email, WhatsApp (con icono), sitio web

**Agencia No Premium:**
6. ⬜ Buscar una agencia NO premium
7. ⬜ Abrir perfil
8. ⬜ **VERIFICAR**: NO aparece botón "Ver más formas de contacto"
9. ⬜ **VERIFICAR**: Solo aparece botón "Solicitar Cotización Gratis"

**✅ PASÓ | ❌ FALLÓ**

---

### 10. Responsive Mobile
**Tiempo: 3 minutos**

Abrir en móvil (o DevTools modo móvil):

1. ⬜ Homepage se ve bien (grid de categorías en 1 columna)
2. ⬜ Menú hamburguesa funciona
3. ⬜ Listado de agencias es scrolleable
4. ⬜ Modal de cotización es scrolleable y usable
5. ⬜ Formulario crear agencia funciona en móvil

**✅ PASÓ | ❌ FALLÓ**

---

## 🔵 VERIFICACIONES RÁPIDAS (Nice to Have)

### 11. Emails Transaccionales
**Tiempo: 2 minutos**

Verificar que lleguen estos emails (de tests anteriores):

| Email | Llegó | Contenido OK |
|-------|-------|--------------|
| Confirmación de cotización (cliente) | ⬜ | ⬜ |
| Nueva cotización (agencia) | ⬜ | ⬜ |
| Agencia aprobada | ⬜ | ⬜ |

**✅ PASÓ | ❌ FALLÓ**

---

### 12. Autenticación Básica
**Tiempo: 2 minutos**

1. ⬜ Cerrar sesión
2. ⬜ Intentar acceder a /dashboard directamente
3. ⬜ **VERIFICAR**: Redirige a login
4. ⬜ Login con email/contraseña
5. ⬜ **VERIFICAR**: Redirige a dashboard correcto

**✅ PASÓ | ❌ FALLÓ**

---

## 📊 RESUMEN

- **Total Tests Críticos**: 12
- **Tiempo Estimado Total**: 30-45 minutos
- **Tests Pasados (✅)**: ___
- **Tests Fallados (❌)**: ___

---

## 🐛 BUGS ENCONTRADOS

| # | Descripción | Severidad | Pantalla |
|---|-------------|-----------|----------|
| 1 | | Alta/Media/Baja | |
| 2 | | Alta/Media/Baja | |
| 3 | | Alta/Media/Baja | |

---

## ✅ CRITERIO DE ÉXITO

**Para considerar el testing exitoso:**
- ✅ Tests de Prioridad Máxima (1-3): 100% pasados
- ✅ Tests de Prioridad Alta (4-7): Mínimo 75% pasados
- ✅ Tests de Prioridad Media (8-10): Mínimo 50% pasados
- ✅ No bugs de severidad Alta

**Si encuentras bugs críticos**, avísame y los arreglo de inmediato.
