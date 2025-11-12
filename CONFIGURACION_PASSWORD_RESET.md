# Configuración de Password Reset en Supabase

## Paso 1: Configurar Redirect URLs

Para que el flujo de recuperación de contraseña funcione correctamente, necesitas agregar la URL de redirección en Supabase.

### Pasos en Supabase Dashboard:

1. Ve a tu proyecto en https://supabase.com/dashboard
2. En el menú lateral, selecciona **Authentication** → **URL Configuration**
3. Busca la sección **"Redirect URLs"**
4. Agrega las siguientes URLs:

**Para desarrollo:**
```
https://[TU-REPLIT-URL].repl.co/auth/actualizar-contrasena
```

**Para producción (cuando publiques):**
```
https://[TU-DOMINIO].com/auth/actualizar-contrasena
```

5. Click en **"Save"**

---

## Paso 2: Configurar Email Templates (Opcional)

Puedes personalizar el email que se envía a los usuarios:

1. En Supabase Dashboard → **Authentication** → **Email Templates**
2. Selecciona **"Reset Password"**
3. Personaliza el template con:
   - Logo de Vitria
   - Colores de marca (#1B5568, #F5D35E)
   - Texto en español

### Ejemplo de template personalizado:

```html
<h2>Recupera tu contraseña de Vitria</h2>
<p>Hola,</p>
<p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en Vitria.</p>
<p>Click en el siguiente enlace para crear una nueva contraseña:</p>
<a href="{{ .ConfirmationURL }}">Restablecer mi contraseña</a>
<p>Si no solicitaste este cambio, puedes ignorar este email.</p>
<p>Saludos,<br>El equipo de Vitria</p>
```

---

## Cómo funciona el flujo:

1. **Usuario olvida su contraseña** → Va a `/auth/login` → Click en "¿Olvidaste tu contraseña?"
2. **Página de recuperación** (`/auth/recuperar-contrasena`):
   - Usuario ingresa su email
   - Sistema envía email con link mágico
3. **Email de Supabase**:
   - Usuario recibe email
   - Click en link → Redirige a `/auth/actualizar-contrasena` con token en URL
4. **Actualización de contraseña** (`/auth/actualizar-contrasena`):
   - Sistema valida token
   - Usuario ingresa nueva contraseña
   - Se actualiza la contraseña
   - Usuario es redirigido al login

---

## Seguridad implementada:

- ✅ Links de recuperación con expiración automática (Supabase default: 1 hora)
- ✅ Validación de contraseña mínima de 6 caracteres
- ✅ Confirmación de contraseña (debe coincidir)
- ✅ Cierre de sesión automático después de cambiar contraseña
- ✅ Mensajes de error claros para usuarios

---

## Notas importantes:

- El link de recuperación solo funciona **una vez**
- Si el usuario no usa el link en 1 hora, debe solicitar uno nuevo
- Después de cambiar la contraseña, el usuario debe iniciar sesión nuevamente
- El flujo funciona tanto para usuarios que se registraron con email/password como con Google OAuth (si configuraron contraseña)
