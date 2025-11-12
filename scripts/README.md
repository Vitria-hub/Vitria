# Scripts de Migración y Utilidades

## Migración de Categorías (migrate-categories.sql)

Este script migra las agencias existentes del sistema antiguo de `services` al nuevo sistema simplificado de `categories`.

### ¿Cuándo usar este script?

Usa este script si tienes agencias existentes que fueron creadas con el sistema antiguo de servicios y quieres que aparezcan en los filtros de las nuevas categorías principales.

### ¿Qué hace el script?

1. **Inicializa el campo categories**: Si está vacío, lo inicializa como array
2. **Mapea services antiguos a categories nuevas**: 
   - "Marketing Digital", "Google Ads", etc. → `publicidad-digital`
   - "Branding", "Diseño de Logo", etc. → `branding-identidad`
   - "Desarrollo Web", "E-commerce", etc. → `desarrollo-web`
   - "Redes Sociales", "Community Management", etc. → `contenido-redes`
   - "Producción Audiovisual", "Fotografía", etc. → `video-fotografia`
   - "Consultoría", "Estrategia Digital", etc. → `estrategia-consultoria`
   - "Relaciones Públicas", "RRPP", etc. → `relaciones-publicas`
   - "Diseño Gráfico", "Material POP", etc. → `diseno-grafico`
3. **Elimina duplicados**: Asegura que cada categoría aparezca solo una vez
4. **Verifica resultados**: Muestra estadísticas de la migración

### Cómo ejecutar el script

#### Opción 1: En Supabase (Producción)

1. Ve a tu proyecto de Supabase
2. Abre el **SQL Editor** en el panel lateral
3. Crea una nueva query
4. Copia y pega el contenido completo de `migrate-categories.sql`
5. Haz clic en **Run** o presiona `Ctrl+Enter`
6. Revisa los resultados de verificación al final

#### Opción 2: En desarrollo (Replit)

```bash
# El script está diseñado para producción, pero si quieres probarlo en desarrollo:
# Primero, asegúrate de tener agencias de prueba con el formato antiguo
# Luego ejecuta el script usando el execute_sql_tool
```

### ⚠️ Importante

- **Backup primero**: Siempre haz un backup de tu base de datos antes de ejecutar migraciones
- **Prueba en desarrollo**: Si es posible, prueba primero en un ambiente de desarrollo
- **No afecta services**: El script NO elimina los `services` antiguos, solo agrega `categories`
- **Es seguro ejecutar múltiples veces**: El script verifica que no agregue categorías duplicadas

### Verificación Post-Migración

Después de ejecutar el script, verifica que:

1. ✅ Las agencias ahora tienen el campo `categories` poblado
2. ✅ Al filtrar por categorías en la UI, aparecen las agencias correctas
3. ✅ Los `services` antiguos se mantienen intactos (para backward compatibility)

### Ejemplo de Resultado

```sql
-- Antes de la migración
name: "CreativeLab"
services: ["Marketing Digital", "Branding", "Redes Sociales"]
categories: [] (vacío)

-- Después de la migración
name: "CreativeLab"
services: ["Marketing Digital", "Branding", "Redes Sociales"]
categories: ["publicidad-digital", "branding-identidad", "contenido-redes"]
```

### ¿Necesitas ayuda?

Si encuentras problemas:
1. Revisa la salida de verificación del script
2. Verifica que las agencias tengan el campo `categories` en su schema
3. Contacta al equipo de desarrollo con los detalles del error
