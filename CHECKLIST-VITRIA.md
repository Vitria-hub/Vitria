# ✅ CHECKLIST DE IMPLEMENTACIÓN COMPLETA - VITRIA

**Propósito:** Este checklist asegura que cualquier nueva feature o campo se implemente completamente en toda la plataforma, sin romper funcionalidad existente.

**Cómo usar:** El usuario indica qué implementar, y el agente debe verificar TODOS los items antes de considerar la tarea completa.

---

## 📋 ANTES DE EMPEZAR

- [ ] Entiendo completamente qué se debe implementar
- [ ] Tengo claro el alcance (solo lectura, CRUD completo, filtros, etc.)
- [ ] Sé si afecta usuarios finales, agencias, o admin
- [ ] Confirmé con el usuario si necesita aparecer en panel de admin
- [ ] Confirmé si el campo es obligatorio u opcional
- [ ] Confirmé si debe ser filtrable en el explorador

---

## 🗄️ BASE DE DATOS

### Estructura de Tabla
- [ ] Columna agregada a la tabla correspondiente (agencies, users, reviews, etc.)
- [ ] Tipo de dato correcto definido
  - [ ] `text` para strings simples
  - [ ] `text[]` para arrays de strings
  - [ ] `integer` para números enteros
  - [ ] `numeric` o `decimal` para números con decimales
  - [ ] `boolean` para verdadero/falso
  - [ ] `timestamp with time zone` para fechas
  - [ ] `uuid` para IDs únicos
- [ ] Nullable/Not Null definido correctamente
- [ ] Valor por defecto establecido (si aplica)
  - [ ] Arrays: `DEFAULT '{}'::text[]`
  - [ ] Booleans: `DEFAULT false`
  - [ ] Timestamps: `DEFAULT NOW()`
- [ ] Índices creados si es campo de búsqueda/filtro frecuente

### TypeScript Schema (lib/supabase.ts)
- [ ] Actualizado el tipo `Row` con el nuevo campo
- [ ] Actualizado el tipo `Insert` con el nuevo campo (opcional si tiene default)
- [ ] Actualizado el tipo `Update` con el nuevo campo (siempre opcional)
- [ ] Verificado que el tipo TypeScript coincida con el tipo de base de datos

### Verificación SQL
- [ ] Ejecutado query para confirmar que la columna existe
- [ ] Verificado que datos existentes tienen el valor por defecto correcto

---

## 🔧 BACKEND

### Validators (lib/validators.ts)
- [ ] Schema de creación actualizado (`createAgencySchema`, `createUserSchema`, etc.)
  - [ ] Campo agregado con validación correcta (z.string(), z.array(), etc.)
  - [ ] Validación de longitud/formato si aplica (.min(), .max(), .email(), etc.)
  - [ ] Opcional/requerido definido correctamente (.optional())
- [ ] Schema de actualización actualizado (`updateAgencySchema`, etc.)
  - [ ] Campo siempre opcional (.optional())
- [ ] Schema de listado/filtros actualizado (`agencyListSchema`, etc.)
  - [ ] Nuevo parámetro de filtro agregado si es filtrable
  - [ ] Tipo correcto (z.string().optional() para filtros individuales)

### Endpoints tRPC

#### Endpoint de Creación (agency.create, etc.)
- [ ] Recibe el nuevo campo en el input
- [ ] Valida usando el schema correcto
- [ ] Guarda el campo en la base de datos
- [ ] Maneja el valor por defecto si no se proporciona

#### Endpoint de Actualización (agency.update, etc.)
- [ ] Recibe el nuevo campo en el input
- [ ] Valida usando el schema correcto
- [ ] Actualiza el campo en la base de datos

#### Endpoint de Listado/Filtros (agency.list, etc.)
- [ ] Acepta el nuevo parámetro de filtro (si aplica)
- [ ] Implementa la lógica de filtrado correcta
  - [ ] `.eq()` para valores exactos
  - [ ] `.contains()` para arrays
  - [ ] `.overlaps()` para intersección de arrays
  - [ ] `.ilike()` para búsqueda de texto
  - [ ] `.gte()` / `.lte()` para rangos numéricos
- [ ] Filtro funciona correctamente con otros filtros combinados

#### Admin Endpoints (admin.updateAgency, admin.getAgency, etc.)
- [ ] Schema de validación actualizado
- [ ] Campo incluido en el objeto de actualización (`cleanedData`)
- [ ] Campo incluido en la respuesta del endpoint de lectura

---

## 🎨 FRONTEND - USUARIO FINAL

### Formulario de Creación (crear-agencia/page.tsx, etc.)
- [ ] Campo agregado al formulario con UI apropiada
  - [ ] Input text para strings
  - [ ] Textarea para textos largos
  - [ ] Select/dropdown para opciones fijas
  - [ ] Checkboxes para arrays de opciones
  - [ ] Number input para números
- [ ] Label descriptivo agregado
- [ ] Placeholder apropiado (si aplica)
- [ ] Estado del formulario (useState) incluye el nuevo campo
- [ ] Valor inicial correcto en useState
- [ ] Validación del lado cliente implementada
  - [ ] Required si es obligatorio
  - [ ] Validación de formato (email, URL, etc.)
  - [ ] Mensajes de error claros
- [ ] Estilos consistentes con el resto del formulario
- [ ] El campo se envía correctamente al backend

### Filtros (components/FilterBar.tsx o similar)
- [ ] Nuevo selector/filtro agregado (si el campo es filtrable)
- [ ] Opción por defecto clara ("Todas las industrias", "Cualquier precio", etc.)
- [ ] Conectado al estado de filtros (`currentFilters`)
- [ ] onChange actualiza los filtros correctamente
- [ ] Query params de URL actualizados (si aplica)
- [ ] Responsive design mantenido (grid cols ajustado si es necesario)

### Vista de Detalle (agencias/[slug]/page.tsx, etc.)
- [ ] Campo visible en la página de detalle (si debe mostrarse públicamente)
- [ ] Formato de presentación apropiado
  - [ ] Arrays mostrados como lista o badges
  - [ ] Fechas formateadas correctamente
  - [ ] URLs como links clickeables
- [ ] Maneja valores null/undefined correctamente

### Formulario de Edición Usuario (si existe)
- [ ] Campo editable por el usuario
- [ ] Carga el valor actual correctamente
- [ ] Actualiza correctamente al guardar

---

## 👨‍💼 PANEL DE ADMIN

### Formulario de Edición Admin (/admin/agencias/[id]/editar)
- [ ] Importación de constantes necesarias (INDUSTRIES, CATEGORIES, etc.)
- [ ] Campo agregado al estado del formulario (`formData` en useState)
  - [ ] Tipo correcto (string, string[], number, etc.)
  - [ ] Valor inicial apropiado ('' para strings, [] para arrays, null para opcionales)
- [ ] useEffect actualizado para cargar el valor existente
  - [ ] Array.isArray() check para arrays
  - [ ] Manejo de valores null/undefined
  - [ ] Conversión de tipos si es necesario
- [ ] UI del campo implementada en el formulario
  - [ ] En la sección correcta (con buen título de sección)
  - [ ] Componente apropiado (input, select, checkboxes, etc.)
  - [ ] Estilos consistentes (border-2, border-gray-200, rounded-lg, etc.)
  - [ ] Helper text explicativo debajo del campo
- [ ] onChange handler actualiza el estado correctamente
  - [ ] toggleArrayItem para checkboxes múltiples
  - [ ] Actualización directa para inputs simples
- [ ] El campo se envía en el submit del formulario
- [ ] Helper function agregada si es necesario (toggleArrayItem, etc.)

### Vista de Listado Admin (/admin/agencias/page.tsx)
- [ ] Columna agregada a la tabla (si debe mostrarse)
- [ ] Formato apropiado para mostrar
- [ ] Sorteable si es relevante

### Vista de Detalle Admin (/admin/agencias/[id]/page.tsx)
- [ ] Campo visible en la vista de detalles admin
- [ ] Formato apropiado de presentación

---

## 📝 CONSTANTES Y CONFIGURACIÓN

### Centralización de Constantes
- [ ] Constantes definidas en un solo lugar (lib/categories.ts, lib/constants.ts, etc.)
- [ ] NO duplicadas en múltiples archivos
- [ ] Exportadas correctamente (`export const INDUSTRIES = [...]`)
- [ ] Tipadas apropiadamente (usar `as const` para arrays inmutables)
- [ ] Documentadas con comentarios si el propósito no es obvio

### Uso Consistente
- [ ] Todas las partes de la app importan de la fuente central
- [ ] No hay "magic strings" hardcodeadas
- [ ] Mismo orden/formato en todas partes

---

## 🧪 VERIFICACIÓN Y TESTING

### Compilación y Build
- [ ] Workflow reiniciado después de cambios backend/frontend
- [ ] No hay errores de compilación TypeScript
- [ ] No hay errores de ESLint críticos
- [ ] LSP diagnostics revisados (solo pre-existentes aceptables)
- [ ] Hot reload funciona correctamente

### Testing Manual - Crear
- [ ] Abrir formulario de creación
- [ ] Llenar todos los campos incluyendo el nuevo
- [ ] Submit del formulario
- [ ] Verificar que se guardó en base de datos
- [ ] Verificar que aparece en listado
- [ ] Verificar que aparece en detalle

### Testing Manual - Editar
- [ ] Abrir un item existente para editar
- [ ] Verificar que el campo actual se carga correctamente
- [ ] Cambiar el valor del nuevo campo
- [ ] Guardar cambios
- [ ] Verificar que se guardó correctamente

### Testing Manual - Filtrar (si aplica)
- [ ] Seleccionar una opción del nuevo filtro
- [ ] Verificar que los resultados se filtran correctamente
- [ ] Probar en combinación con otros filtros
- [ ] Verificar que URL query params se actualizan
- [ ] Verificar que funciona al cargar la página con query param

### Testing Manual - Admin
- [ ] Login como admin
- [ ] Abrir panel de edición de un item
- [ ] Verificar que el campo se muestra
- [ ] Verificar que el valor actual se carga
- [ ] Cambiar el valor
- [ ] Guardar
- [ ] Verificar que se actualizó correctamente
- [ ] Verificar que el cambio se refleja en el frontend público

### Testing de Datos Existentes
- [ ] Items creados antes de la implementación se cargan correctamente
- [ ] Tienen el valor por defecto apropiado
- [ ] No se rompe nada al cargar items antiguos
- [ ] Se pueden editar sin problemas

---

## 🔄 COMPATIBILIDAD (NO ROMPER NADA)

### Migraciones Seguras
- [ ] No se cambiaron tipos de columnas de ID (serial, uuid, varchar)
- [ ] No se eliminaron columnas existentes sin migración
- [ ] No se renombraron columnas sin alias/migración
- [ ] Campos nuevos son opcionales cuando hay datos existentes

### Backward Compatibility
- [ ] Código existente sigue compilando
- [ ] Endpoints existentes no cambiaron su contrato
- [ ] Componentes existentes no se rompieron
- [ ] Datos existentes siguen siendo válidos

### Valores por Defecto
- [ ] Datos existentes tienen valor por defecto sensato
- [ ] Arrays vacíos en lugar de null para campos array
- [ ] Strings vacíos o null apropiadamente manejados
- [ ] Números 0 o null según el contexto

---

## 📚 DOCUMENTACIÓN

### replit.md
- [ ] Nueva feature documentada
  - [ ] En la sección apropiada (Key Features, Backend, Frontend, etc.)
  - [ ] Descripción clara de qué hace
  - [ ] Mención de dónde está implementada (archivos clave)
  - [ ] Fecha de implementación (Mes Año)
- [ ] Cambios técnicos importantes registrados
- [ ] Ejemplos de uso si es complejo

### Comentarios en Código
- [ ] Solo si la lógica es compleja o no obvia
- [ ] Explicación del "por qué", no del "qué"
- [ ] Sin comentarios redundantes

---

## 🚀 ENTREGA

### Screenshots
- [ ] Screenshot del campo en el formulario de creación
- [ ] Screenshot del filtro funcionando (si aplica)
- [ ] Screenshot del panel de admin con el campo
- [ ] Screenshots muestran datos reales (no placeholders si es posible)

### Comunicación al Usuario
- [ ] Resumen claro de qué se implementó
- [ ] Lista de dónde está disponible la nueva feature
  - [ ] Formulario de creación
  - [ ] Filtros (si aplica)
  - [ ] Panel de admin
- [ ] Instrucciones de uso claras y simples
- [ ] Confirmación de que todo está funcionando
- [ ] Mención de compatibilidad con datos existentes

### Verificación Final del Agente
- [ ] He revisado TODOS los items de este checklist
- [ ] He probado la funcionalidad end-to-end
- [ ] No hay errores en consola del navegador
- [ ] No hay errores en logs del servidor
- [ ] La documentación está actualizada
- [ ] Estoy listo para mostrar screenshots y demo

---

## 🎯 CÓMO USAR ESTE CHECKLIST

### Para el Usuario:
Cuando solicites una nueva feature, simplemente di:
> "Implementa [FEATURE] siguiendo el checklist de Vitria"

O más específico:
> "Agrega un campo 'precio_hora' a las agencias, debe ser filtrable, aparecer en admin, sigue el checklist"

### Para el Agente:
1. **Leer el checklist completo** antes de empezar
2. **Planificar** qué secciones del checklist aplican
3. **Implementar** sistemáticamente siguiendo el orden del checklist
4. **Verificar** cada item antes de marcarlo como completo
5. **No declarar la tarea terminada** hasta que TODOS los items aplicables estén ✅
6. **Mostrar screenshots** y evidencia de que todo funciona
7. **Comunicar claramente** qué se hizo y cómo usarlo

---

## 📊 SECCIONES POR TIPO DE IMPLEMENTACIÓN

### Nuevo Campo Simple (ej: descripción_corta)
Aplican secciones:
- ✅ Base de Datos
- ✅ Backend (validators + endpoints)
- ✅ Frontend Usuario (formulario creación)
- ✅ Panel Admin
- ✅ Verificación y Testing
- ✅ Documentación
- ✅ Entrega

### Nuevo Filtro (ej: filtrar por industria)
Aplican todas las secciones:
- ✅ Base de Datos
- ✅ Backend (validators + filtrado)
- ✅ Frontend Usuario (filtros + formulario)
- ✅ Panel Admin
- ✅ Constantes (lista de opciones)
- ✅ Verificación y Testing
- ✅ Documentación
- ✅ Entrega

### Cambio Solo UI (ej: nuevo color de botón)
Aplican secciones:
- ✅ Frontend
- ✅ Verificación (visual)
- ❌ Base de Datos (no aplica)
- ❌ Backend (no aplica)

---

## 🔴 BANDERAS ROJAS - DETENER Y REVISAR

Si ves cualquiera de estos, DETENTE y revisa el checklist:

- ❌ "Falta agregar esto al panel de admin"
- ❌ "Olvidé actualizar el schema de TypeScript"
- ❌ "No probé si los datos existentes se rompen"
- ❌ "Duplicé la constante en 3 archivos diferentes"
- ❌ "El filtro no funciona correctamente"
- ❌ "Cambié el tipo de ID de una tabla"
- ❌ "No actualicé la documentación"

**Si el usuario tiene que pedirte 2-3 veces que completes algo, significa que no seguiste el checklist correctamente.**

---

## ✨ BONUS: PUNTOS DE CALIDAD

Más allá del checklist básico, considera:

- [ ] Accesibilidad: labels apropiados, aria-labels si es necesario
- [ ] Mobile responsive: el campo se ve bien en móvil
- [ ] Validación UX: mensajes de error amigables
- [ ] Performance: índices en campos de búsqueda frecuente
- [ ] Seguridad: sanitización de inputs, validación server-side
- [ ] Analytics: tracking del nuevo campo si es relevante
- [ ] SEO: si afecta contenido público, considerar meta tags

---

**Última actualización:** Noviembre 2024
**Versión:** 1.0
**Mantenido por:** Equipo Vitria
