# Instrucciones para arreglar OAuth en Supabase

## El problema:
Supabase tiene configuradas las URLs de redirección (redirect URLs) y solo permite las que están en su lista blanca. Aunque hayas actualizado NEXT_PUBLIC_SITE_URL, Supabase sigue usando las URLs viejas.

## Solución:

1. Ve a tu proyecto de Supabase: https://supabase.com/dashboard/project/ccwosdaxmtfzbqcrrfvd

2. En el menú lateral, busca "Authentication" → "URL Configuration"

3. Busca la sección "Redirect URLs" o "Site URL"

4. Debes configurar:
   - **Site URL**: https://vitria.cl
   - **Redirect URLs** (agregar estas):
     * https://vitria.cl/auth/callback
     * https://vitria.cl/**

5. IMPORTANTE: Asegúrate de que NO esté configurada ninguna URL de desarrollo (replit.dev, etc.)

6. Guarda los cambios

7. Espera 1-2 minutos para que se apliquen

8. Prueba de nuevo el inicio de sesión con Google en vitria.cl

## URLs actuales de tu proyecto:
- Desarrollo: https://vitria.replit.app
- Producción: https://vitria.cl

En Supabase SOLO debe estar configurada la URL de producción para que funcione correctamente.
