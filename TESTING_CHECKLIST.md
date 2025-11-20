# ✅ Checklist de Testing - Vitria

## Instrucciones de Uso
- Marca con ✅ cuando pases el test
- Marca con ❌ si encuentra un bug
- Anota observaciones en la columna de notas

---

## 1. FORMULARIO DE COTIZACIÓN (Cambios Recientes)

### 1.1 Usuario Autenticado
| Test | Estado | Notas |
|------|--------|-------|
| Al abrir modal, nombre se pre-llena automáticamente | ⬜ | |
| Al abrir modal, email se pre-llena automáticamente | ⬜ | |
| Campos nombre y email son editables aunque estén pre-llenados | ⬜ | |
| Campo WhatsApp aparece vacío (opcional) | ⬜ | |
| Selector muestra las 6 categorías nuevas correctamente | ⬜ | |
| NO aparecen categorías antiguas (Marketing Digital, Branding viejo, etc.) | ⬜ | |
| Formulario se envía correctamente | ⬜ | |
| Aparece mensaje de éxito tras enviar | ⬜ | |
| Email de confirmación llega al cliente | ⬜ | |
| Email de notificación llega a la agencia | ⬜ | |
| Después de cerrar modal con éxito y volver a abrir, campos siguen pre-llenados | ⬜ | |

### 1.2 Usuario NO Autenticado (Visitante)
| Test | Estado | Notas |
|------|--------|-------|
| Campos nombre y email aparecen vacíos | ⬜ | |
| Formulario muestra mensaje requiriendo llenar nombre y email | ⬜ | |
| Selector de categorías muestra las 6 nuevas | ⬜ | |
| Puede enviar cotización sin estar logueado | ⬜ | |
| Recibe email de confirmación | ⬜ | |

---

## 2. TERMINOLOGÍA "WHATSAPP" (Cambios Recientes)

### 2.1 Formularios Principales
| Página | Campo debe decir "WhatsApp" (no "Teléfono") | Estado | Notas |
|--------|---------------------------------------------|--------|-------|
| Solicitar Cotización (modal) | Campo opcional dice "WhatsApp (opcional)" | ⬜ | |
| Crear Agencia - Paso 1 | Campo requerido dice "WhatsApp *" | ⬜ | |
| Editar Perfil de Agencia | Campo requerido dice "WhatsApp *" | ⬜ | |
| Admin: Editar Agencia | Campo dice "WhatsApp *" | ⬜ | |
| Admin: Editar Agencia | Campo premium dice "WhatsApp Adicional (Premium)" | ⬜ | |

### 2.2 Validaciones
| Test | Estado | Notas |
|------|--------|-------|
| Error de validación dice "WhatsApp inválido" (no "Teléfono inválido") | ⬜ | |
| Crear agencia sin WhatsApp muestra error correcto | ⬜ | |
| Editar perfil sin WhatsApp muestra error correcto | ⬜ | |

### 2.3 Analytics y Dashboards
| Página | Debe decir "WhatsApp" | Estado | Notas |
|--------|----------------------|--------|-------|
| Mi Agencia > Analytics | Métrica dice "Clicks en WhatsApp" | ⬜ | |
| Mi Agencia > Leads | Método de contacto muestra "WhatsApp" | ⬜ | |
| Admin > Agencias (detalle) | Campo muestra "WhatsApp" | ⬜ | |

### 2.4 Documentación Legal
| Página | Menciona "WhatsApp" correctamente | Estado | Notas |
|--------|-----------------------------------|--------|-------|
| FAQ - Pregunta sobre contacto directo | Dice "email, WhatsApp, sitio web" | ⬜ | |
| FAQ - Pregunta sobre plan Premium | Dice "email, WhatsApp, sitio web" | ⬜ | |
| Términos de Servicio - Sección Premium | Menciona "WhatsApp" | ⬜ | |
| Política de Privacidad - Datos de agencias | Dice "email, WhatsApp, sitio web" | ⬜ | |

---

## 3. SISTEMA DE CATEGORÍAS (6 Nuevas)

### 3.1 Homepage
| Test | Estado | Notas |
|------|--------|-------|
| Muestra exactamente 6 categorías en grid 3x2 | ⬜ | |
| Categoría 1: Performance & Ads | ⬜ | |
| Categoría 2: Social Media | ⬜ | |
| Categoría 3: Diseño y Branding | ⬜ | |
| Categoría 4: Desarrollo Web | ⬜ | |
| Categoría 5: Producción de Contenido | ⬜ | |
| Categoría 6: Relaciones Públicas | ⬜ | |
| Cada categoría muestra contador correcto de agencias | ⬜ | |
| Al hacer click en categoría, filtra correctamente en /agencias | ⬜ | |

### 3.2 Filtros de Búsqueda
| Test | Estado | Notas |
|------|--------|-------|
| Filtro de categorías en /agencias muestra las 6 nuevas | ⬜ | |
| Seleccionar categoría filtra correctamente | ⬜ | |
| Agencias con categorías legacy se muestran en nueva categoría consolidada | ⬜ | |
| Contador de resultados es correcto | ⬜ | |

### 3.3 Crear/Editar Agencia
| Test | Estado | Notas |
|------|--------|-------|
| Selector de categorías muestra las 6 opciones | ⬜ | |
| Permite seleccionar múltiples categorías | ⬜ | |
| Al guardar, las categorías se asocian correctamente | ⬜ | |
| En editar perfil, muestra categorías actuales seleccionadas | ⬜ | |

---

## 4. FLUJO COMPLETO: CLIENTE

### 4.1 Registro y Onboarding
| Test | Estado | Notas |
|------|--------|-------|
| Puede registrarse con email y contraseña | ⬜ | |
| Puede registrarse con Google OAuth | ⬜ | |
| Después de registro, redirige a crear perfil de cliente | ⬜ | |
| Formulario de perfil cliente muestra nuevos rangos de presupuesto (Menos de 1M, etc.) | ⬜ | |
| Puede seleccionar categorías que busca (6 nuevas) | ⬜ | |
| Después de completar perfil, redirige a /agencias | ⬜ | |

### 4.2 Búsqueda de Agencias
| Test | Estado | Notas |
|------|--------|-------|
| Puede buscar agencias por categoría | ⬜ | |
| Puede buscar agencias por región | ⬜ | |
| Puede buscar agencias por rango de precios | ⬜ | |
| Puede buscar agencias por nombre/servicio | ⬜ | |
| Resultados muestran logo, nombre, ubicación, rating | ⬜ | |
| Badge "Premium" aparece en agencias premium | ⬜ | |
| Click en agencia abre perfil completo | ⬜ | |

### 4.3 Ver Perfil de Agencia
| Test | Estado | Notas |
|------|--------|-------|
| Muestra información básica (nombre, descripción, ubicación) | ⬜ | |
| Muestra servicios y categorías | ⬜ | |
| Muestra reseñas y rating | ⬜ | |
| Botón "Solicitar Cotización Gratis" visible | ⬜ | |
| Agencia premium muestra botón "Ver más formas de contacto" | ⬜ | |
| Al expandir contacto premium, muestra email, WhatsApp, sitio web | ⬜ | |
| Agencia no premium NO muestra contacto directo | ⬜ | |

### 4.4 Solicitar Cotización
| Test | Estado | Notas |
|------|--------|-------|
| Modal se abre correctamente | ⬜ | |
| Nombre y email pre-llenados si está autenticado | ⬜ | |
| Puede llenar detalles del proyecto | ⬜ | |
| Puede seleccionar categoría de servicio (6 nuevas) | ⬜ | |
| Puede seleccionar presupuesto estimado | ⬜ | |
| Envío exitoso muestra mensaje de confirmación | ⬜ | |
| Recibe email de confirmación | ⬜ | |

### 4.5 Dejar Reseña
| Test | Estado | Notas |
|------|--------|-------|
| Puede dejar rating de 1-5 estrellas | ⬜ | |
| Puede escribir comentario | ⬜ | |
| Reseña entra en estado "pending" para moderación | ⬜ | |
| No puede dejar reseña si no está autenticado | ⬜ | |

---

## 5. FLUJO COMPLETO: AGENCIA

### 5.1 Registro y Aprobación
| Test | Estado | Notas |
|------|--------|-------|
| Puede registrarse seleccionando "Tipo: Agencia" | ⬜ | |
| Después de registro, redirige a crear agencia (wizard 3 pasos) | ⬜ | |

### 5.2 Crear Agencia (Wizard 3 Pasos)
| Test | Estado | Notas |
|------|--------|-------|
| **Paso 1 - Info Básica**: Puede subir logo | ⬜ | |
| **Paso 1**: Nombre, descripción (mín 50 chars), email, WhatsApp requeridos | ⬜ | |
| **Paso 1**: Ciudad, región requeridos | ⬜ | |
| **Paso 1**: Sitio web opcional | ⬜ | |
| **Paso 1**: No permite avanzar sin campos requeridos | ⬜ | |
| **Paso 2 - Servicios**: Puede seleccionar categorías (6 nuevas) | ⬜ | |
| **Paso 2**: Puede seleccionar servicios específicos | ⬜ | |
| **Paso 2**: Puede agregar especialidades | ⬜ | |
| **Paso 2**: Requiere al menos 1 categoría para avanzar | ⬜ | |
| **Paso 3 - Detalles**: Puede seleccionar tamaño de equipo | ⬜ | |
| **Paso 3**: Puede seleccionar rango de precios (4 opciones con "Menos de 1M") | ⬜ | |
| **Paso 3**: Puede seleccionar industrias | ⬜ | |
| Envío final crea agencia en estado "pending" | ⬜ | |
| Redirige a dashboard con mensaje de "agencia creada" | ⬜ | |
| Dashboard muestra banner "pendiente de aprobación" | ⬜ | |

### 5.3 Dashboard de Agencia
| Test | Estado | Notas |
|------|--------|-------|
| Muestra métricas reales (vistas, clicks, contactos, cotizaciones) | ⬜ | |
| Nueva agencia muestra 0 en todas las métricas (no números mock) | ⬜ | |
| Widget "Salud del Perfil" muestra porcentaje correcto | ⬜ | |
| Widget muestra qué falta completar (si aplica) | ⬜ | |
| Botón "Editar Perfil" funciona | ⬜ | |
| Si está pendiente, muestra mensaje de espera de aprobación | ⬜ | |

### 5.4 Editar Perfil de Agencia
| Test | Estado | Notas |
|------|--------|-------|
| Carga datos actuales correctamente | ⬜ | |
| Puede cambiar logo | ⬜ | |
| Puede editar descripción | ⬜ | |
| Campo WhatsApp muestra valor actual | ⬜ | |
| Puede cambiar categorías | ⬜ | |
| Puede cambiar rango de precios (4 opciones) | ⬜ | |
| Validaciones funcionan (descripción mín 50 chars, WhatsApp mín 8 chars) | ⬜ | |
| Guardar actualiza datos correctamente | ⬜ | |
| Muestra mensaje de éxito | ⬜ | |

### 5.5 Ver Cotizaciones Recibidas
| Test | Estado | Notas |
|------|--------|-------|
| /mi-agencia/leads muestra lista de cotizaciones | ⬜ | |
| Cada cotización muestra nombre, email, WhatsApp (si lo dejó) del cliente | ⬜ | |
| Muestra detalles del proyecto | ⬜ | |
| Muestra presupuesto estimado | ⬜ | |
| Muestra categoría del servicio solicitado | ⬜ | |
| Contador de total de leads es correcto | ⬜ | |

### 5.6 Ver Analytics
| Test | Estado | Notas |
|------|--------|-------|
| /mi-agencia/analytics muestra vistas del perfil | ⬜ | |
| Muestra "Clicks en WhatsApp" (no "en Teléfono") | ⬜ | |
| Muestra clicks en email | ⬜ | |
| Muestra clicks en sitio web | ⬜ | |
| Muestra formularios enviados | ⬜ | |
| Gráficas cargan correctamente | ⬜ | |

---

## 6. FLUJO COMPLETO: ADMIN

### 6.1 Dashboard Admin
| Test | Estado | Notas |
|------|--------|-------|
| /admin muestra KPIs (total usuarios, agencias, cotizaciones) | ⬜ | |
| Gráficas de actividad cargan | ⬜ | |
| Navegación a secciones funciona | ⬜ | |

### 6.2 Gestión de Agencias
| Test | Estado | Notas |
|------|--------|-------|
| /admin/agencias muestra lista completa | ⬜ | |
| Puede filtrar por estado (pending, approved, rejected) | ⬜ | |
| Badge "Premium" visible en agencias premium | ⬜ | |
| Click en agencia abre modal de detalle | ⬜ | |
| Modal muestra campo "WhatsApp" (no "Teléfono") | ⬜ | |

### 6.3 Aprobar/Rechazar Agencias
| Test | Estado | Notas |
|------|--------|-------|
| Botón "Aprobar" cambia estado a approved | ⬜ | |
| Agencia aprobada aparece en listado público /agencias | ⬜ | |
| Email de aprobación se envía a la agencia | ⬜ | |
| Botón "Rechazar" requiere razón | ⬜ | |
| Email de rechazo se envía con la razón | ⬜ | |

### 6.4 Editar Agencia (Admin)
| Test | Estado | Notas |
|------|--------|-------|
| /admin/agencias/[id]/editar carga datos correctos | ⬜ | |
| Puede cambiar nombre, descripción | ⬜ | |
| Campo muestra "WhatsApp *" | ⬜ | |
| Campo muestra "WhatsApp Adicional (Premium)" | ⬜ | |
| Puede activar/desactivar estado Premium | ⬜ | |
| Puede cambiar categorías | ⬜ | |
| Puede cambiar rango de precios (4 opciones) | ⬜ | |
| Guardar actualiza datos correctamente | ⬜ | |

### 6.5 Gestión de Cotizaciones
| Test | Estado | Notas |
|------|--------|-------|
| /admin/cotizaciones muestra todas las cotizaciones | ⬜ | |
| Puede ver detalles de cada cotización | ⬜ | |
| Muestra cliente, agencia, fecha, estado | ⬜ | |

### 6.6 Moderación de Reseñas
| Test | Estado | Notas |
|------|--------|-------|
| Puede ver reseñas pendientes | ⬜ | |
| Puede aprobar reseñas | ⬜ | |
| Puede rechazar reseñas | ⬜ | |
| Reseña aprobada aparece en perfil de agencia | ⬜ | |

---

## 7. RANGOS DE PRECIO (4 Opciones - Cambio Reciente)

| Contexto | Muestra 4 rangos correctos | Estado | Notas |
|----------|---------------------------|--------|-------|
| Crear Agencia - Paso 3 | Menos de 1M, 1-3M, 3-5M, 5M+ | ⬜ | |
| Editar Perfil - Sección Detalles | Menos de 1M, 1-3M, 3-5M, 5M+ | ⬜ | |
| Admin Editar Agencia | Menos de 1M, 1-3M, 3-5M, 5M+ | ⬜ | |
| Crear Perfil Cliente | Menos de 1M, 1-3M, 3-5M, 5M+ | ⬜ | |
| Filtros en /agencias | Menos de 1M, 1-3M, 3-5M, 5M+ | ⬜ | |

---

## 8. AUTENTICACIÓN Y SEGURIDAD

### 8.1 Login
| Test | Estado | Notas |
|------|--------|-------|
| Login con email/contraseña funciona | ⬜ | |
| Login con Google OAuth funciona | ⬜ | |
| Error de credenciales incorrectas se muestra | ⬜ | |
| Después de login redirige al dashboard correcto (cliente vs agencia) | ⬜ | |

### 8.2 Logout
| Test | Estado | Notas |
|------|--------|-------|
| Botón "Cerrar Sesión" funciona | ⬜ | |
| Redirige a homepage | ⬜ | |
| No puede acceder a rutas protegidas después de logout | ⬜ | |

### 8.3 Recuperación de Contraseña
| Test | Estado | Notas |
|------|--------|-------|
| Link "Olvidé mi contraseña" funciona | ⬜ | |
| Email de recuperación llega | ⬜ | |
| Link del email funciona | ⬜ | |
| Puede establecer nueva contraseña | ⬜ | |
| Puede loguearse con nueva contraseña | ⬜ | |

### 8.4 Protección de Rutas
| Test | Estado | Notas |
|------|--------|-------|
| Visitante NO puede acceder a /dashboard | ⬜ | |
| Visitante NO puede acceder a /mi-agencia/analytics | ⬜ | |
| Cliente NO puede acceder a /mi-agencia/* | ⬜ | |
| Agencia NO puede acceder a /admin/* | ⬜ | |
| Solo admin puede acceder a /admin/* | ⬜ | |

---

## 9. RESPONSIVE / MOBILE

| Test | Estado | Notas |
|------|--------|-------|
| Homepage se ve bien en móvil | ⬜ | |
| Grid de categorías es 1 columna en móvil | ⬜ | |
| Listado de agencias funciona en móvil | ⬜ | |
| Perfil de agencia se ve bien en móvil | ⬜ | |
| Modal de cotización es scrolleable en móvil | ⬜ | |
| Formulario crear agencia funciona en móvil | ⬜ | |
| Dashboard de agencia se ve bien en móvil | ⬜ | |
| Panel admin funciona en móvil | ⬜ | |

---

## 10. EMAILS TRANSACCIONALES

| Tipo de Email | Se envía | Contenido correcto | Estado | Notas |
|---------------|----------|-------------------|--------|-------|
| Bienvenida (nuevo usuario) | ⬜ | ⬜ | | |
| Confirmación de cotización (cliente) | ⬜ | ⬜ | | |
| Nueva cotización (agencia) | ⬜ | ⬜ | | |
| Agencia aprobada | ⬜ | ⬜ | | |
| Agencia rechazada | ⬜ | ⬜ | | |
| Recuperación de contraseña | ⬜ | ⬜ | | |

---

## 11. PERFORMANCE Y CARGA

| Test | Estado | Notas |
|------|--------|-------|
| Homepage carga en menos de 3 segundos | ⬜ | |
| Listado de agencias carga rápido (con 20+ agencias) | ⬜ | |
| Búsqueda/filtros responden rápido | ⬜ | |
| Dashboard de analytics carga en menos de 3 segundos | ⬜ | |
| Imágenes (logos, covers) se cargan correctamente | ⬜ | |

---

## 12. SEO Y METADATA

| Test | Estado | Notas |
|------|--------|-------|
| Homepage tiene title y description correctos | ⬜ | |
| Páginas de agencia tienen metadata dinámica | ⬜ | |
| sitemap.xml se genera correctamente | ⬜ | |
| robots.txt está configurado | ⬜ | |

---

## 13. BUGS CONOCIDOS / CASOS EDGE

| Test | Estado | Notas |
|------|--------|-------|
| Agencia sin logo muestra placeholder correcto | ⬜ | |
| Agencia sin portafolio no rompe la UI | ⬜ | |
| Búsqueda sin resultados muestra mensaje amigable | ⬜ | |
| Formularios validan antes de enviar (no errores de servidor) | ⬜ | |
| Caracteres especiales en descripción se manejan bien | ⬜ | |
| URLs muy largas no rompen diseño | ⬜ | |

---

## RESUMEN DE TESTING

- **Total Tests**: ___ 
- **Pasados (✅)**: ___
- **Fallados (❌)**: ___
- **Porcentaje de Éxito**: ___%

## BUGS ENCONTRADOS

1. 
2. 
3. 

## NOTAS GENERALES
