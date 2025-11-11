# 🚀 Información de Deployment - Vitria

## ✅ Configuración Completada

### 📋 Deployment Settings
- **Tipo**: Autoscale (serverless)
- **Build**: `npm run build`
- **Run**: `npm run start`
- **Puerto**: 5000

### 🔐 Credenciales de Admin
- **Email**: contacto@scalelab.cl
- **Contraseña**: Scalelab2026
- **Rol**: admin (verificado en base de datos)

### 🗄️ Base de Datos
- **Proveedor**: Supabase
- **URL**: https://ccwosdaxmtfzbqcrrfvd.supabase.co
- **Tablas**: ✅ Creadas
- **RLS Policies**: ✅ Configuradas
- **Usuario Admin**: ✅ Creado

### 🌐 URLs de Desarrollo
- **Home**: https://b06cc163-930a-421d-9cd5-f7906907e8b1-00-1qrs5507109s3.spock.replit.dev
- **Admin Login**: https://b06cc163-930a-421d-9cd5-f7906907e8b1-00-1qrs5507109s3.spock.replit.dev/auth/login
- **Admin Panel**: https://b06cc163-930a-421d-9cd5-f7906907e8b1-00-1qrs5507109s3.spock.replit.dev/admin

## 📝 Cómo Publicar

### Paso 1: Hacer clic en "Deploy" 
En Replit, busca el botón **"Deploy"** en la parte superior derecha.

### Paso 2: Esperar el Build
El sistema hará automáticamente:
1. `npm run build` (compila Next.js para producción)
2. `npm run start` (inicia servidor de producción)

### Paso 3: Obtener URL de Producción
Una vez publicado, Replit te dará una URL pública permanente.

## ✅ Verificaciones Post-Deployment

Después de publicar, verifica:
1. ✅ Página principal carga correctamente
2. ✅ Login funciona con las credenciales admin
3. ✅ Panel de admin es accesible en `/admin`
4. ✅ Todas las secciones del backoffice funcionan

## 🛠️ Variables de Entorno Necesarias

Asegúrate que estas variables estén configuradas en Replit:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE`
- `NEXT_PUBLIC_SITE_URL` (se actualizará automáticamente a la URL de producción)

## 📊 Panel de Administración

El panel incluye:
- 📈 Dashboard con estadísticas
- 🏢 Gestión de Agencias (verificar, eliminar)
- ⭐ Moderación de Reseñas (aprobar, rechazar)
- 👥 Administración de Usuarios (cambiar roles, eliminar)

Todas las funcionalidades están protegidas y solo accesibles para usuarios con rol `admin`.
