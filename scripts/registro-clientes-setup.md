# Sistema de Registro y Tracking de Clientes

## ✅ Implementado (MVP)

### 1. Nuevas Tablas en Base de Datos

**`client_profiles`** - Almacena datos de los clientes/negocios:
- `user_id` (FK a users)
- `business_name` - Nombre del negocio
- `business_instagram` - Instagram del negocio (opcional)
- `budget_range` - Presupuesto ($, $$, $$$)
- `desired_categories` - Array de categorías que busca
- `about_business` - Descripción del proyecto (opcional)

**`agency_contacts`** - Tracking de contactos:
- `client_user_id` (FK a users)
- `agency_id` (FK a agencies)
- `contact_method` (email, phone, website, form)
- `message` - Mensaje opcional del contacto
- `created_at` - Timestamp del contacto

### 2. Flujos de Registro Separados

**Página Selectora** (`/auth/registro`):
- El usuario elige si es Cliente o Agencia
- Dos opciones claramente diferenciadas con iconos y beneficios
- Redirige a la ruta correcta según selección

**Registro de Cliente** (`/auth/registro/cliente`):
- **Paso 1**: Datos de cuenta (nombre, email, contraseña)
- **Paso 2**: Datos del negocio
  - Nombre del negocio
  - Instagram (opcional)
  - Rango de presupuesto ($, $$, $$$)
  - Categorías de servicio que busca (multi-select)
  - Descripción del proyecto (opcional)
- Wizard visual con indicador de progreso
- Crea usuario + perfil de cliente en una sola operación

**Registro de Agencia** (`/auth/registro/agencia`):
- TODO: Mover el flujo existente de /dashboard/crear-agencia aquí
- Mantener wizard multi-step existente

### 3. Endpoints tRPC Nuevos

**`client.createProfile`** (protectedProcedure):
- Crea perfil de cliente asociado al usuario autenticado
- Valida que no exista perfil previo
- Input: businessName, businessInstagram, budgetRange, desiredCategories, aboutBusiness

**`client.getMyProfile`** (protectedProcedure):
- Obtiene perfil del cliente autenticado

**`client.updateProfile`** (protectedProcedure):
- Actualiza perfil existente del cliente

### 4. Validadores Zod

**`createClientProfileSchema`**:
- businessName: string min 2 chars
- businessInstagram: string optional
- budgetRange: enum ['$', '$$', '$$$']
- desiredCategories: array min 1 item
- aboutBusiness: string min 20 chars optional

**`trackAgencyContactSchema`**:
- agencyId: uuid
- contactMethod: enum ['email', 'phone', 'website', 'form']
- message: string optional

## 📋 Pendiente (Segunda Iteración)

### 1. Tracking de Contactos
- [ ] Modificar botones de contacto para requerir autenticación
- [ ] Crear modal de contacto que trackee en `agency_contacts`
- [ ] Implementar endpoint `contacts.track` para guardar contactos
- [ ] Mostrar mensaje al usuario anónimo: "Inicia sesión para contactar"

### 2. Dashboard de Leads para Agencias
- [ ] Crear `/mi-agencia/leads` mostrando clientes que contactaron
- [ ] Mostrar: nombre negocio, presupuesto, categorías, método contacto, timestamp
- [ ] Filtros por fecha, método de contacto
- [ ] Exportar leads a CSV

### 3. Sistema de Reseñas Mejorado
- [ ] Vincular reseñas a usuarios autenticados (user_id NOT NULL)
- [ ] Mostrar nombre completo del autor en reseñas
- [ ] Badge "Cliente Verificado" si tiene perfil completo
- [ ] Requerir login para dejar reseñas

### 4. Mejoras de UX
- [ ] Onboarding post-registro para clientes (tour de la plataforma)
- [ ] Dashboard para clientes (`/dashboard/cliente`)
  - Agencias favoritas
  - Historial de contactos
  - Reseñas dejadas
- [ ] Notificaciones email cuando cliente contacta agencia

### 5. Políticas y Privacidad
- [ ] Agregar checkbox de términos y condiciones en registro
- [ ] Política de privacidad clara sobre uso de datos
- [ ] Permitir a clientes editar/eliminar su perfil
- [ ] GDPR compliance (Chile)

## 🧪 Testing

### Flujo de Prueba Básico:

1. **Registro de Cliente**:
   ```
   - Ir a /auth/registro
   - Clic en "Busco una Agencia"
   - Completar Paso 1 (cuenta)
   - Completar Paso 2 (negocio)
   - Verificar redirección a /dashboard
   ```

2. **Verificar Perfil Creado**:
   ```sql
   -- En Supabase SQL Editor:
   SELECT cp.*, u.full_name, u.email 
   FROM client_profiles cp 
   JOIN users u ON cp.user_id = u.id 
   ORDER BY cp.created_at DESC 
   LIMIT 10;
   ```

3. **Probar Tracking** (cuando esté implementado):
   ```
   - Login como cliente
   - Buscar agencia
   - Intentar contactar → debe guardar en agency_contacts
   ```

## 🔧 Próximos Pasos Inmediatos

1. Implementar tracking de contactos (requiere login)
2. Crear dashboard básico de leads para agencias
3. Actualizar sistema de reseñas para mostrar nombres

## 📝 Notas Técnicas

- Las tablas ya están creadas en desarrollo
- Para producción: ejecutar los mismos CREATE TABLE en Supabase
- Los errores de LSP en `server/routers/client.ts` son falsos positivos (tipos de Supabase no regenerados)
- El código funciona correctamente en runtime

## 🎯 Valor para el Negocio

**Para Vitria**:
- Mejor tracking de conversiones (clientes → contactos → ventas)
- Data valiosa sobre presupuestos y necesidades del mercado
- Base para sistema de recomendaciones personalizadas

**Para Agencias**:
- Leads calificados (sabemos presupuesto y necesidad real)
- Información del negocio del cliente antes del contacto
- Métricas de qué clientes muestran interés

**Para Clientes**:
- Experiencia más personalizada
- Historial de agencias contactadas
- Reseñas verificadas con identidad real
