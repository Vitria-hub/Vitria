# 🚀 Guía de Deployment para vitria.cl

## ✅ Configuración Completada en Replit
- ✅ Deployment configurado como Autoscale
- ✅ Build: `npm run build`
- ✅ Run: `npm run start`

---

## 📋 PASOS PARA LANZAR A PRODUCCIÓN

### **PASO 1: PUBLICAR EN REPLIT**

1. **Haz clic en el botón "Publish" en tu workspace de Replit**
2. **Selecciona "Autoscale Deployment"**
3. **Configuración recomendada:**
   - Machine: 1vCPU, 2 GiB RAM
   - Max machines: 3
   - Build command: `npm run build` (ya configurado)
   - Run command: `npm run start` (ya configurado)
4. **Haz clic en "Publish"** - tu app estará live en pocos minutos

---

### **PASO 2: CONFIGURAR DOMINIO PERSONALIZADO vitria.cl**

#### **2.1 En Replit:**
1. Ve a la pestaña **"Deployments"**
2. Haz clic en **"Settings"**
3. Selecciona **"Link a domain"** o **"Manually connect from another registrar"**
4. Ingresa: `vitria.cl` y también `www.vitria.cl` (haz esto dos veces)
5. Replit te generará registros DNS:
   ```
   Tipo: A
   Host: @ (o vitria.cl)
   Valor: [IP que te da Replit]
   
   Tipo: TXT
   Host: @ (o vitria.cl)
   Valor: [Token de verificación]
   ```

#### **2.2 En tu registrador de dominios (.cl):**
1. Accede al panel de gestión DNS de vitria.cl
2. **Agrega los registros A y TXT** que Replit te proporcionó
3. **Importante:** Si tienes registros A antiguos, elimínalos o reemplázalos
4. **TTL:** Configúralo lo más bajo posible (300 segundos)
5. Espera propagación DNS (5 minutos a 48 horas, usualmente ~15 minutos)

---

### **PASO 3: ACTUALIZAR GOOGLE OAUTH**

#### **3.1 En Google Cloud Console:**
URL: https://console.cloud.google.com/apis/credentials

**Agrega estas URIs (MANTÉN las actuales, solo agrega):**

**Authorized JavaScript origins:**
```
https://vitria.replit.app          (mantener para desarrollo)
https://vitria.cl                  (AGREGAR)
https://www.vitria.cl             (AGREGAR)
```

**Authorized redirect URIs:**
```
https://ccwosdaxmtfzbqcrrfvd.supabase.co/auth/v1/callback  (mantener)
https://vitria.replit.app/api/auth/callback                (opcional dev)
```

⚠️ **NOTA:** Si Supabase requiere custom domain, actualiza después del Paso 4.

**Tiempo de propagación:** 5 minutos a algunas horas

---

### **PASO 4: CONFIGURAR SUPABASE**

#### **4.1 Actualizar Site URL:**
1. Ve a tu proyecto en https://supabase.com
2. **Authentication** → **URL Configuration**
3. **Site URL:** Cambia a `https://vitria.cl`
4. **Redirect URLs:** Agrega:
   ```
   https://vitria.cl/**
   https://www.vitria.cl/**
   https://vitria.replit.app/**  (mantener para dev)
   ```

#### **4.2 Verificar Production Checklist:**
- ✅ **Row Level Security (RLS)** habilitado en todas las tablas sensibles
- ✅ **Email confirmations** habilitadas en Settings → Auth
- ✅ **SMTP custom** configurado (Brevo)
- ✅ **Database backups** configurados
- ✅ **Rate limits** revisados para auth endpoints

---

### **PASO 5: VARIABLES DE ENTORNO EN REPLIT**

Verifica que estos secrets estén configurados en producción:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ccwosdaxmtfzbqcrrfvd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[tu-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[tu-service-key]

# Google OAuth
GOOGLE_CLIENT_ID=[tu-client-id]
GOOGLE_CLIENT_SECRET=[tu-secret]

# Brevo Email
BREVO_API_KEY=[tu-api-key]

# App URLs (Replit los configura automáticamente)
NEXT_PUBLIC_APP_URL=https://vitria.cl
```

⚠️ **IMPORTANTE:** Verifica que `NEXT_PUBLIC_APP_URL` apunte a `https://vitria.cl` en producción.

---

### **PASO 6: TESTING POST-DEPLOYMENT**

Una vez que el dominio esté activo, prueba:

1. ✅ **Homepage** carga correctamente: https://vitria.cl
2. ✅ **Login con Google** funciona sin errores
3. ✅ **Registro de usuario** funciona
4. ✅ **Crear agencia** funciona
5. ✅ **Enviar cotización** funciona y emails llegan
6. ✅ **Búsqueda de agencias** funciona
7. ✅ **Dashboard de cliente** muestra cotizaciones
8. ✅ **Analytics admin** funciona
9. ✅ **SSL/HTTPS** activo (candado verde en navegador)
10. ✅ **Sitemap:** https://vitria.cl/sitemap.xml
11. ✅ **Robots.txt:** https://vitria.cl/robots.txt

---

## 🔄 OPCIONAL: Custom Domain para Supabase

Si quieres usar `api.vitria.cl` para Supabase (más profesional):

### Requisitos:
- Plan Supabase Pro o superior
- Supabase CLI instalado

### Pasos:
```bash
# 1. Crear CNAME
CNAME: api.vitria.cl → ccwosdaxmtfzbqcrrfvd.supabase.co

# 2. Crear custom domain
supabase domains create \
  --project-ref ccwosdaxmtfzbqcrrfvd \
  --custom-hostname api.vitria.cl \
  --experimental

# 3. Agregar registros TXT (Supabase te los dará)
TXT: _cf-custom-hostname.api.vitria.cl → [verification-token]
TXT: api.vitria.cl → [ssl-validation-token]

# 4. Verificar
supabase domains reverify --project-ref ccwosdaxmtfzbqcrrfvd

# 5. Actualizar Google OAuth redirect URIs
https://api.vitria.cl/auth/v1/callback

# 6. Activar (⚠️ causa downtime de 20-30 min)
supabase domains activate --project-ref ccwosdaxmtfzbqcrrfvd --experimental
```

**⚠️ ADVERTENCIA:** Solo hazlo si es absolutamente necesario, causa downtime.

---

## 📊 MONITOREO POST-LAUNCH

### Replit:
- Revisa logs de deployment en la pestaña "Deployments"
- Monitorea uso de recursos (CPU, RAM)

### Supabase:
- Verifica Database → Usage
- Revisa Auth → Users para nuevos registros
- Monitorea Database → Logs para errores

### Google Search Console:
- Envía tu sitemap: https://vitria.cl/sitemap.xml
- Solicita indexación de páginas principales

---

## 🆘 TROUBLESHOOTING

### "Error: redirect_uri_mismatch" en Google OAuth
→ Verifica que las URIs en Google Cloud coincidan EXACTAMENTE con tu dominio
→ Espera 5-10 minutos después de actualizar en Google Cloud

### Dominio no resuelve después de 1 hora
→ Verifica registros DNS con: https://dnschecker.org
→ Asegúrate de que no hay registros A antiguos conflictivos

### Emails no llegan
→ Verifica BREVO_API_KEY en Replit Secrets
→ Revisa logs de Brevo en su dashboard

### Imágenes/Assets no cargan
→ Verifica que Object Storage esté configurado correctamente
→ Revisa políticas de CORS en Replit Object Storage

---

## ✅ CHECKLIST FINAL

Antes de anunciar el lanzamiento:

- [ ] Dominio vitria.cl apunta a Replit y muestra el sitio
- [ ] SSL/HTTPS activo (candado verde)
- [ ] Login con Google funciona
- [ ] Registro de usuarios funciona
- [ ] Envío de emails funciona (test con cotización)
- [ ] Todas las páginas cargan correctamente
- [ ] Mobile responsive verificado
- [ ] SEO: Sitemap y robots.txt activos
- [ ] Google Search Console configurado
- [ ] Analytics funcionando
- [ ] Política de privacidad y términos visibles

---

## 🎉 DESPUÉS DEL LANZAMIENTO

1. **Anuncia en redes sociales**
2. **Envía comunicado a agencias chilenas**
3. **Registra en directorios de startups chilenas**
4. **Solicita indexación en Google Search Console**
5. **Monitorea métricas en /admin/analytics**

---

**¿Necesitas ayuda?** Revisa los logs de Replit y Supabase para diagnosticar problemas.
