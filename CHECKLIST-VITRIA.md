# ✅ CHECKLIST VITRIA - Implementación Completa

**Propósito:** Asegurar que cualquier feature nueva esté implementada en TODOS los lugares necesarios sin romper nada.

---

## 🎯 CÓMO USAR

**Usuario:** "Implementa [FEATURE] siguiendo el checklist Vitria"

**Agente:** Revisar y completar TODOS los items aplicables antes de entregar.

---

## 📝 CHECKLIST ESENCIAL

### 1️⃣ BASE DE DATOS
```
[ ] Columna agregada a la tabla con tipo correcto
[ ] Default value establecido (si hay datos existentes)
[ ] ⚠️ CRÍTICO: Cache de Supabase invalidado
    - Ejecutar: SELECT pg_notify('pgrst', 'reload schema');
    - Esto es OBLIGATORIO después de agregar/modificar columnas
[ ] Schema TypeScript actualizado (lib/supabase.ts)
    - Row type
    - Insert type  
    - Update type
```

### 2️⃣ BACKEND
```
[ ] Validators actualizados (lib/validators.ts)
    - createSchema: campo agregado con validación
    - updateSchema: campo agregado (siempre opcional)
    - listSchema: filtro agregado (si es filtrable)

[ ] Endpoints actualizados
    - agency.create: guarda el nuevo campo
    - agency.update: actualiza el nuevo campo
    - agency.list: filtra por el campo (si aplica)
    - admin.updateAgency: acepta y guarda el campo
```

### 3️⃣ FRONTEND USUARIO
```
[ ] Formulario de creación (crear-agencia/page.tsx)
    - Campo agregado al formData (useState)
    - UI del campo implementada
    - Se envía al backend en el submit

[ ] Filtros (components/FilterBar.tsx) - si aplica
    - Selector agregado
    - Conectado a currentFilters
    - Query actualizado correctamente
```

### 4️⃣ PANEL ADMIN
```
[ ] Formulario de edición (/admin/agencias/[id]/editar)
    - Campo en formData (useState)
    - useEffect carga el valor existente
    - UI del campo implementada
    - Se envía al backend en submit
```

### 5️⃣ CONSTANTES - si aplica
```
[ ] Definidas en lib/categories.ts (o similar)
[ ] Importadas desde ese archivo en TODAS partes
[ ] NO duplicadas en múltiples archivos
```

### 6️⃣ VERIFICACIÓN
```
[ ] Crear nuevo item: funciona ✓
[ ] Editar item existente: funciona ✓
[ ] Filtrar (si aplica): funciona ✓
[ ] Panel admin: carga y guarda correctamente ✓
[ ] Items antiguos: no se rompen ✓
[ ] No hay errores en consola ✓
```

### 7️⃣ ENTREGA
```
[ ] replit.md actualizado con la nueva feature
[ ] Screenshot mostrando funcionamiento
[ ] Instrucciones claras de uso
```

---

## 🔴 REGLAS DE ORO

1. **Columna nueva en DB** = SIEMPRE ejecutar `SELECT pg_notify('pgrst', 'reload schema');` después
2. **Campo nuevo + datos existentes** = SIEMPRE opcional o con default
3. **Constantes** = UN solo archivo, importadas en todos lados
4. **Admin panel** = Si el campo existe, debe ser editable aquí
5. **Filtros** = Si es filtrable, debe estar en backend Y frontend
6. **Testing** = Probar con datos nuevos Y antiguos

---

## ⚡ QUICK REFERENCE

**Campo simple** (ej: "descripción_corta")
→ Aplica: 1, 2 (validators + create/update), 3 (creación), 4, 6, 7

**Campo filtrable** (ej: "industrias")  
→ Aplica: TODO (1, 2, 3, 4, 5, 6, 7)

**Solo UI** (ej: "cambiar color botón")
→ Aplica: solo verificación visual

---

**Versión:** 2.0 - Concisa
**Última actualización:** Nov 2024
