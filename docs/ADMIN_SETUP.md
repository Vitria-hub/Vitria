# Configuración del Panel de Administración

Este documento explica cómo configurar el sistema de administración de Vitria.

## 🔐 Crear el Primer Usuario Administrador

Para acceder al panel de administración, necesitas crear un usuario con rol `admin` en Supabase.

### Opción 1: Desde Supabase Dashboard (Recomendado)

1. Ve a tu proyecto de Supabase Dashboard
2. Abre el **SQL Editor**
3. Ejecuta esta query SQL para convertir un usuario existente en admin:

```sql
-- Reemplaza 'tu-email@ejemplo.com' con el email del usuario que quieres hacer admin
UPDATE users
SET role = 'admin'
WHERE auth_id = (
  SELECT id 
  FROM auth.users 
  WHERE email = 'tu-email@ejemplo.com'
);
```

4. Verifica que el cambio se aplicó:

```sql
SELECT u.full_name, u.role, au.email
FROM users u
JOIN auth.users au ON u.auth_id = au.id
WHERE u.role = 'admin';
```

### Opción 2: Durante el Registro

1. Regístrate normalmente en Vitria
2. Inmediatamente después, ejecuta el SQL de la Opción 1 en Supabase
3. Cierra sesión y vuelve a iniciar sesión
4. Deberías ver "Panel de Admin" en el menú de usuario

## 📋 Acceso al Panel de Administración

### URL del Panel
- **Desarrollo**: `http://localhost:5000/admin`
- **Producción**: `https://tu-dominio.com/admin`

### Navegación
Una vez que inicies sesión como administrador, verás:
- **Panel de Admin** en el menú desplegable de usuario (color morado)
- Acceso a todas las funcionalidades administrativas

## 🛠️ Funcionalidades del Panel

### 1. Dashboard Principal (`/admin`)
- **Estadísticas generales**:
  - Total de agencias (con pendientes sin verificar)
  - Total de usuarios
  - Total de reseñas (con pendientes por moderar)
- **Acceso rápido** a las secciones de gestión

### 2. Gestionar Agencias (`/admin/agencias`)
- Ver todas las agencias registradas
- Filtrar por estado: Todas / Verificadas / Sin verificar
- **Acciones disponibles**:
  - ✅ Verificar agencia (marca de confianza)
  - ❌ Desverificar agencia
  - 🗑️ Eliminar agencia (y todo su contenido)
- Paginación automática (20 por página)

### 3. Gestionar Reseñas (`/admin/resenas`)
- Ver todas las reseñas del marketplace
- Filtrar por estado: Todas / Pendientes / Aprobadas / Rechazadas
- **Acciones disponibles**:
  - ✅ Aprobar reseña (aparecerá públicamente)
  - ❌ Rechazar reseña (no aparecerá)
  - 🗑️ Eliminar reseña permanentemente
- Ver agencia asociada y calificación

### 4. Gestionar Usuarios (`/admin/usuarios`)
- Ver todos los usuarios registrados
- Filtrar por rol: Todos / Clientes / Agencias / Administradores
- **Acciones disponibles**:
  - Cambiar rol de usuario (user / agency / admin)
  - 🗑️ Eliminar usuario (elimina todas sus agencias y reseñas)
- Ver fecha de registro

## 🔒 Seguridad

- ✅ Todas las rutas de admin están protegidas con middleware
- ✅ Solo usuarios con `role = 'admin'` pueden acceder
- ✅ Verificación en frontend y backend (tRPC)
- ✅ Redirección automática si no eres admin

## 🚨 Importante

- **No elimines el único usuario administrador** - Si lo haces, necesitarás acceso a la base de datos para crear otro
- **Respaldo de datos** - Las eliminaciones son permanentes y en cascada
- **Roles de usuarios**:
  - `user`: Cliente que busca agencias
  - `agency`: Dueño de agencia
  - `admin`: Administrador del marketplace

## 📊 Flujo de Moderación Recomendado

### Para Agencias Nuevas:
1. Usuario se registra como "Agencia"
2. Usuario crea su perfil de agencia
3. Agencia aparece en el marketplace **inmediatamente**
4. Admin verifica la agencia desde `/admin/agencias`
5. Agencias verificadas tienen mejor posicionamiento

### Para Reseñas:
1. Usuario deja reseña en una agencia
2. Reseña queda en estado `pending`
3. Admin modera desde `/admin/resenas`
4. Solo reseñas `approved` aparecen públicamente
5. Reseñas aprobadas actualizan el rating de la agencia automáticamente

## 🎯 Mejores Prácticas

1. **Modera reseñas regularmente** - Las reseñas pendientes no aparecen públicamente
2. **Verifica agencias reales** - La verificación es una marca de confianza
3. **Comunica las políticas** - Deja claro qué tipo de contenido se aprueba
4. **Monitorea métricas** - Usa las estadísticas para tomar decisiones

## 🔧 Soporte Técnico

Si encuentras problemas:
1. Verifica que el usuario tenga `role = 'admin'` en la tabla `users`
2. Verifica que el `auth_id` coincida con el ID en `auth.users`
3. Cierra sesión y vuelve a iniciar sesión
4. Revisa los logs del servidor en caso de errores
