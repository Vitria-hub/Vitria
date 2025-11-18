import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from '@getbrevo/brevo';

const brevoApi = new TransactionalEmailsApi();
brevoApi.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!);

interface AgencyData {
  id: string;
  name: string;
  email: string;
  phone: string;
  website?: string;
  location_city: string;
  location_region: string;
  description: string;
  categories: string[];
  services: string[];
  owner_email: string;
  owner_name: string;
}

function getBaseUrl(): string {
  // If running in production (REPLIT_DEPLOYMENT=1), use production URL
  if (process.env.REPLIT_DEPLOYMENT === '1') {
    return process.env.NEXT_PUBLIC_SITE_URL || 'https://vitria.cl';
  }
  
  // In development, use dev domain
  if (process.env.REPLIT_DEV_DOMAIN) {
    return `https://${process.env.REPLIT_DEV_DOMAIN}`;
  }
  
  // Fallback to configured site URL
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // Fallback for production
  if (process.env.NODE_ENV === 'production') {
    return 'https://vitria.cl';
  }
  
  // Local development fallback
  return 'http://localhost:3000';
}

function getAdminEmail(): string {
  return process.env.ADMIN_EMAIL || 'contacto@scalelab.cl';
}

export async function sendAgencyReviewEmail(agencyData: AgencyData) {
  const baseUrl = getBaseUrl();
  const reviewUrl = `${baseUrl}/admin/agencias/${agencyData.id}`;

  try {
    await brevoApi.sendTransacEmail({
      sender: { 
        name: "Vitria Platform", 
        email: "noreply@vitria.cl" 
      },
      to: [{ 
        email: getAdminEmail(),
        name: "Equipo Vitria"
      }],
      subject: `Nueva agencia para revisar: ${agencyData.name}`,
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1B5568; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; }
            .agency-info { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .info-row { margin: 10px 0; }
            .label { font-weight: bold; color: #1B5568; }
            .button-container { text-align: center; margin: 30px 0; }
            .button { display: inline-block; padding: 12px 30px; margin: 0 10px; text-decoration: none; border-radius: 5px; font-weight: bold; }
            .approve { background-color: #10B981; color: white; }
            .reject { background-color: #EF4444; color: white; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Nueva Agencia Registrada</h1>
            </div>
            <div class="content">
              <p>Se ha registrado una nueva agencia en Vitria que requiere revisión:</p>
              
              <div class="agency-info">
                <h2 style="color: #1B5568; margin-top: 0;">${agencyData.name}</h2>
                
                <div class="info-row">
                  <span class="label">Email:</span> ${agencyData.email}
                </div>
                
                <div class="info-row">
                  <span class="label">Teléfono:</span> ${agencyData.phone}
                </div>
                
                ${agencyData.website ? `
                <div class="info-row">
                  <span class="label">Sitio web:</span> <a href="${agencyData.website}">${agencyData.website}</a>
                </div>
                ` : ''}
                
                <div class="info-row">
                  <span class="label">Ubicación:</span> ${agencyData.location_city}, ${agencyData.location_region}
                </div>
                
                <div class="info-row">
                  <span class="label">Categorías:</span> ${agencyData.categories.join(', ')}
                </div>
                
                <div class="info-row">
                  <span class="label">Servicios:</span> ${agencyData.services.join(', ')}
                </div>
                
                <div class="info-row">
                  <span class="label">Descripción:</span>
                  <p style="margin-top: 5px;">${agencyData.description}</p>
                </div>
                
                <div class="info-row">
                  <span class="label">Propietario:</span> ${agencyData.owner_name} (${agencyData.owner_email})
                </div>
              </div>
              
              <div class="button-container">
                <a href="${reviewUrl}" class="button approve" style="background-color: #1B5568;">Revisar Agencia</a>
              </div>
              
              <p style="text-align: center; color: #666; font-size: 14px;">
                Haz clic en el botón para ver todos los detalles y decidir si aprobar o rechazar.
              </p>
            </div>
            <div class="footer">
              <p>Este es un correo automático de Vitria Platform</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
  } catch (error) {
    console.error('Error sending agency review email:', error);
    throw error;
  }
}

export async function sendAgencyWaitlistEmail(agencyName: string, ownerEmail: string, ownerName: string) {
  try {
    await brevoApi.sendTransacEmail({
      sender: { 
        name: "Vitria", 
        email: "noreply@vitria.cl" 
      },
      to: [{ 
        email: ownerEmail,
        name: ownerName
      }],
      subject: `¡Bienvenido a la lista de espera de Vitria! - ${agencyName}`,
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1B5568; color: white; padding: 30px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 30px; }
            .highlight { background-color: #F5D35E; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>¡Gracias por registrarte en Vitria!</h1>
            </div>
            <div class="content">
              <p>Hola ${ownerName},</p>
              
              <p>Hemos recibido el registro de <strong>${agencyName}</strong> en Vitria.</p>
              
              <div class="highlight">
                <h2 style="margin-top: 0; color: #1B5568;">Has entrado a nuestra lista de espera</h2>
                <p>Nuestro equipo está revisando tu solicitud cuidadosamente para asegurar la calidad de nuestra plataforma.</p>
              </div>
              
              <p><strong>¿Qué sigue?</strong></p>
              <ul>
                <li>Revisaremos la información de tu agencia</li>
                <li>Te notificaremos por email cuando tu agencia sea aprobada</li>
                <li>Una vez aprobada, tu agencia será visible para todos los usuarios de Vitria</li>
              </ul>
              
              <p>Este proceso generalmente toma entre 24-48 horas. Te mantendremos informado del progreso.</p>
              
              <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
              
              <p>Saludos,<br>
              <strong>El equipo de Vitria</strong></p>
            </div>
            <div class="footer">
              <p>Este es un correo automático de Vitria Platform</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
  } catch (error) {
    console.error('Error sending waitlist email:', error);
    throw error;
  }
}

export async function sendAgencyApprovalEmail(agencyName: string, ownerEmail: string, ownerName: string, agencySlug: string) {
  const baseUrl = getBaseUrl();
  const agencyUrl = `${baseUrl}/agencias/${agencySlug}`;
  
  try {
    await brevoApi.sendTransacEmail({
      sender: { 
        name: "Vitria", 
        email: "noreply@vitria.cl" 
      },
      to: [{ 
        email: ownerEmail,
        name: ownerName
      }],
      subject: `¡Tu agencia ${agencyName} ha sido aprobada!`,
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #10B981; color: white; padding: 30px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 30px; }
            .success-box { background-color: #D1FAE5; border-left: 4px solid #10B981; padding: 20px; margin: 20px 0; }
            .button { display: inline-block; padding: 15px 30px; background-color: #1B5568; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 ¡Felicitaciones!</h1>
            </div>
            <div class="content">
              <p>Hola ${ownerName},</p>
              
              <div class="success-box">
                <h2 style="margin-top: 0; color: #10B981;">Tu agencia está ahora en vivo</h2>
                <p style="margin-bottom: 0;"><strong>${agencyName}</strong> ha sido aprobada y ya está visible en Vitria para todos los usuarios.</p>
              </div>
              
              <p><strong>¿Qué puedes hacer ahora?</strong></p>
              <ul>
                <li>Tu agencia aparecerá en los resultados de búsqueda</li>
                <li>Los clientes potenciales podrán ver tu perfil completo</li>
                <li>Comenzarás a recibir contactos interesados en tus servicios</li>
                <li>Puedes actualizar tu perfil en cualquier momento</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="${agencyUrl}" class="button">Ver mi Agencia en Vitria</a>
              </div>
              
              <p>Te deseamos mucho éxito en Vitria. Si tienes alguna pregunta o necesitas ayuda, estamos aquí para apoyarte.</p>
              
              <p>Saludos,<br>
              <strong>El equipo de Vitria</strong></p>
            </div>
            <div class="footer">
              <p>Este es un correo automático de Vitria Platform</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
  } catch (error) {
    console.error('Error sending approval email:', error);
    throw error;
  }
}

export async function sendWelcomeEmail(userEmail: string, userName: string, userRole: 'user' | 'agency') {
  const baseUrl = getBaseUrl();
  const exploreUrl = `${baseUrl}/agencias`;
  const dashboardUrl = `${baseUrl}/dashboard`;
  
  const isAgency = userRole === 'agency';
  const displayName = userName && userName.trim() ? userName : 'Amigo';
  
  try {
    await brevoApi.sendTransacEmail({
      sender: { 
        name: "Vitria", 
        email: "noreply@vitria.cl" 
      },
      to: [{ 
        email: userEmail,
        name: displayName
      }],
      subject: isAgency ? '🚀 ¡Bienvenido a Vitria! Conecta con clientes en Chile' : '✨ ¡Bienvenido a Vitria! Encuentra tu agencia ideal',
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700;800&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Quicksand', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6; 
              color: #1a1a1a;
              background: #f0f4f8;
              padding: 20px 0;
            }
            .email-wrapper { 
              max-width: 650px; 
              margin: 0 auto; 
              background: white;
              overflow: hidden;
              box-shadow: 0 20px 60px rgba(0,0,0,0.12);
            }
            .hero-banner {
              background: linear-gradient(135deg, #1B5568 0%, #134551 100%);
              padding: 50px 40px;
              text-align: center;
              position: relative;
              overflow: hidden;
            }
            .hero-banner::before {
              content: '';
              position: absolute;
              top: -50%;
              right: -10%;
              width: 300px;
              height: 300px;
              background: radial-gradient(circle, rgba(245,211,94,0.15) 0%, transparent 70%);
              border-radius: 50%;
            }
            .hero-banner::after {
              content: '';
              position: absolute;
              bottom: -30%;
              left: -10%;
              width: 250px;
              height: 250px;
              background: radial-gradient(circle, rgba(245,211,94,0.1) 0%, transparent 70%);
              border-radius: 50%;
            }
            .logo-badge {
              background: white;
              width: 90px;
              height: 90px;
              border-radius: 20px;
              margin: 0 auto 25px;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 8px 25px rgba(0,0,0,0.15);
              position: relative;
              z-index: 1;
            }
            .hero-title { 
              color: white; 
              font-size: 42px;
              font-weight: 800;
              margin-bottom: 12px;
              letter-spacing: -0.5px;
              position: relative;
              z-index: 1;
            }
            .hero-subtitle {
              color: #F5D35E;
              font-size: 19px;
              font-weight: 600;
              position: relative;
              z-index: 1;
              text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .accent-bar {
              height: 8px;
              background: linear-gradient(90deg, #F5D35E 0%, #fde047 100%);
            }
            .content { 
              padding: 45px 40px;
              background: white;
            }
            .welcome-message {
              text-align: center;
              margin-bottom: 40px;
            }
            .greeting {
              font-size: 28px;
              color: #1B5568;
              font-weight: 700;
              margin-bottom: 15px;
            }
            .intro-text {
              font-size: 17px;
              color: #4a5568;
              line-height: 1.7;
              max-width: 500px;
              margin: 0 auto;
            }
            .highlight-box {
              background: linear-gradient(135deg, #F5D35E 0%, #fbbf24 100%);
              padding: 35px;
              border-radius: 16px;
              margin: 40px 0;
              box-shadow: 0 4px 20px rgba(245,211,94,0.3);
              border: 3px solid #fff;
              outline: 2px solid #F5D35E;
            }
            .highlight-box h2 {
              color: #1B5568;
              font-size: 24px;
              margin-bottom: 18px;
              font-weight: 800;
              text-align: center;
            }
            .highlight-box p {
              color: #1f2937;
              font-size: 16px;
              line-height: 1.8;
              text-align: center;
            }
            .features-grid {
              margin: 45px 0;
            }
            .section-title {
              color: #1B5568;
              font-size: 26px;
              margin-bottom: 30px;
              font-weight: 800;
              text-align: center;
            }
            .feature-card {
              background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
              border-left: 5px solid #F5D35E;
              padding: 25px;
              margin-bottom: 20px;
              border-radius: 12px;
              box-shadow: 0 2px 12px rgba(0,0,0,0.06);
              transition: all 0.3s ease;
            }
            .feature-card-inner {
              display: flex;
              align-items: start;
            }
            .feature-icon {
              background: linear-gradient(135deg, #1B5568 0%, #134551 100%);
              color: #F5D35E;
              width: 50px;
              height: 50px;
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 20px;
              flex-shrink: 0;
              font-size: 24px;
              box-shadow: 0 4px 12px rgba(27,85,104,0.25);
            }
            .feature-content h3 {
              color: #1B5568;
              font-size: 18px;
              margin-bottom: 8px;
              font-weight: 700;
            }
            .feature-content p {
              color: #4a5568;
              font-size: 15px;
              line-height: 1.6;
            }
            .cta-section {
              text-align: center;
              margin: 50px 0 40px;
              padding: 40px 30px;
              background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
              border-radius: 16px;
            }
            .cta-text {
              color: #1B5568;
              font-size: 20px;
              font-weight: 700;
              margin-bottom: 25px;
            }
            .button-primary {
              display: inline-block;
              padding: 18px 45px;
              background: linear-gradient(135deg, #1B5568 0%, #134551 100%);
              color: #ffffff !important;
              text-decoration: none;
              border-radius: 12px;
              font-weight: 700;
              font-size: 17px;
              box-shadow: 0 6px 20px rgba(27,85,104,0.35);
              margin: 8px;
              transition: all 0.3s ease;
            }
            .button-secondary {
              display: inline-block;
              padding: 16px 40px;
              background: white;
              color: #1B5568 !important;
              text-decoration: none;
              border-radius: 12px;
              font-weight: 700;
              font-size: 16px;
              border: 3px solid #1B5568;
              margin: 8px;
              transition: all 0.3s ease;
            }
            .footer {
              background: #1B5568;
              padding: 35px 40px;
              text-align: center;
            }
            .footer-title {
              color: #F5D35E;
              font-size: 18px;
              font-weight: 700;
              margin-bottom: 15px;
            }
            .footer-text {
              color: rgba(255,255,255,0.8);
              font-size: 14px;
              margin-bottom: 20px;
              line-height: 1.6;
            }
            .footer-links {
              margin: 20px 0;
            }
            .footer-link {
              display: inline-block;
              margin: 0 12px;
              color: #F5D35E !important;
              text-decoration: none;
              font-size: 14px;
              font-weight: 600;
            }
            .copyright {
              color: rgba(255,255,255,0.6);
              font-size: 12px;
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid rgba(255,255,255,0.1);
            }
            @media only screen and (max-width: 600px) {
              body { padding: 0; }
              .hero-banner { padding: 40px 25px; }
              .hero-title { font-size: 32px; }
              .hero-subtitle { font-size: 16px; }
              .content { padding: 35px 25px; }
              .greeting { font-size: 24px; }
              .intro-text { font-size: 16px; }
              .highlight-box { padding: 25px; }
              .button-primary { padding: 16px 35px; font-size: 16px; }
              .button-secondary { padding: 14px 30px; font-size: 15px; }
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="hero-banner">
              <div class="logo-badge">
                <svg width="60" height="60" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                  <rect x="10" y="10" width="45" height="45" rx="12" fill="#1B5568"/>
                  <rect x="65" y="10" width="45" height="45" rx="12" fill="#6F9CEB"/>
                  <rect x="10" y="65" width="45" height="45" rx="12" fill="#64D5C3"/>
                  <rect x="65" y="65" width="45" height="45" rx="12" fill="#F5D35E"/>
                </svg>
              </div>
              <h1 class="hero-title">¡Bienvenido a Vitria!</h1>
              <p class="hero-subtitle">${isAgency ? 'Tu plataforma para conectar con clientes en Chile' : 'Encuentra la agencia perfecta para tu proyecto'}</p>
            </div>
            
            <div class="accent-bar"></div>
            
            <div class="content">
              <div class="welcome-message">
                <div class="greeting">Hola ${displayName} 👋</div>
              
              <p class="intro-text">
                ${isAgency 
                  ? 'Estamos emocionados de tenerte en Vitria. Acabas de unirte al directorio de agencias más completo de Chile.'
                  : 'Ahora tienes acceso al directorio más completo de agencias de marketing, branding y publicidad en Chile.'
                }
              </p>
              </div>
              
              <div class="highlight-box">
                <h2>💡 Nuestra Misión</h2>
                <p>
                  Vitria nace con un propósito claro: <strong>fortalecer el ecosistema de marketing y publicidad en Chile</strong>. 
                  Conectamos talento creativo con oportunidades reales.
                </p>
              </div>
              
              <div class="features-grid">
                <h2 class="section-title">
                  ${isAgency ? '🎯 ¿Qué puedes hacer en Vitria?' : '✨ ¿Por qué elegir Vitria?'}
                </h2>
                
                ${isAgency ? `
                <div class="feature-card">
                  <div class="feature-card-inner">
                    <div class="feature-icon">🎯</div>
                    <div class="feature-content">
                      <h3>Visibilidad Instantánea</h3>
                      <p>Tu agencia será visible para cientos de clientes potenciales cada día.</p>
                    </div>
                  </div>
                </div>
                
                <div class="feature-card">
                  <div class="feature-card-inner">
                    <div class="feature-icon">📊</div>
                    <div class="feature-content">
                      <h3>Analytics Detallado</h3>
                      <p>Métricas en tiempo real sobre visitas y el interés de clientes.</p>
                    </div>
                  </div>
                </div>
                
                <div class="feature-card">
                  <div class="feature-card-inner">
                    <div class="feature-icon">⭐</div>
                    <div class="feature-content">
                      <h3>Reputación Verificada</h3>
                      <p>Construye tu reputación con reseñas de clientes reales.</p>
                    </div>
                  </div>
                </div>
                
                <div class="feature-card">
                  <div class="feature-card-inner">
                    <div class="feature-icon">🚀</div>
                    <div class="feature-content">
                      <h3>Crecimiento Sostenible</h3>
                      <p>Recibe contactos calificados que realmente necesitan tus servicios.</p>
                    </div>
                  </div>
                </div>
                ` : `
                <div class="feature-card">
                  <div class="feature-card-inner">
                    <div class="feature-icon">🔍</div>
                    <div class="feature-content">
                      <h3>Búsqueda Especializada</h3>
                      <p>Filtra por categoría, ubicación y servicios para encontrar la agencia ideal.</p>
                    </div>
                  </div>
                </div>
                
                <div class="feature-card">
                  <div class="feature-card-inner">
                    <div class="feature-icon">✨</div>
                    <div class="feature-content">
                      <h3>Agencias Verificadas</h3>
                      <p>Todas las agencias están cuidadosamente verificadas para garantizar calidad.</p>
                    </div>
                  </div>
                </div>
                
                <div class="feature-card">
                  <div class="feature-card-inner">
                    <div class="feature-icon">💬</div>
                    <div class="feature-content">
                      <h3>Reseñas Reales</h3>
                      <p>Lee experiencias de otros clientes para tomar decisiones informadas.</p>
                    </div>
                  </div>
                </div>
                
                <div class="feature-card">
                  <div class="feature-card-inner">
                    <div class="feature-icon">🎨</div>
                    <div class="feature-content">
                      <h3>Portafolios Completos</h3>
                      <p>Explora trabajos anteriores y conoce el estilo de cada agencia.</p>
                    </div>
                  </div>
                </div>
                `}
              </div>
              
              <div class="cta-section">
                <p class="cta-text">
                  ${isAgency 
                    ? '🚀 ¿Listo para comenzar?'
                    : '🎯 ¿Listo para encontrar tu agencia ideal?'
                  }
                </p>
                <a href="${dashboardUrl}" class="button-primary">
                  ${isAgency ? 'Ir a Mi Panel' : 'Ver Mi Dashboard'}
                </a>
                <br>
                <a href="${exploreUrl}" class="button-secondary">
                  Explorar Agencias
                </a>
              </div>
              
              <p style="color: #4a5568; font-size: 15px; line-height: 1.7; margin: 35px 0 25px 0; text-align: center;">
                Si tienes alguna pregunta, estamos aquí para ayudarte. 💙
              </p>
              
              <p style="color: #1B5568; font-weight: 700; text-align: center; font-size: 16px;">
                ¡Bienvenido a la comunidad Vitria!<br>
                <span style="color: #4a5568; font-weight: 400; font-size: 14px;">— El equipo de Vitria</span>
              </p>
            </div>
            
            <div class="footer">
              <p class="footer-title">Vitria</p>
              <p class="footer-text">
                El directorio de agencias líder en Chile
              </p>
              <div class="footer-links">
                <a href="${baseUrl}" class="footer-link">Visitar Vitria</a>
                <span style="color: #cbd5e0;">•</span>
                <a href="${baseUrl}/blog" class="footer-link">Blog</a>
                <span style="color: #cbd5e0;">•</span>
                <a href="${baseUrl}/agencias" class="footer-link">Agencias</a>
              </div>
              <p style="color: #a0aec0; font-size: 12px; margin-top: 15px;">
                © ${new Date().getFullYear()} Vitria. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
}

interface QuoteNotificationData {
  agencyName: string;
  agencyEmail: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  projectName: string;
  projectDescription: string;
  budgetRange: string;
  serviceCategory: string;
  quoteId: string;
}

export async function sendQuoteNotificationToAgency(data: QuoteNotificationData) {
  const baseUrl = getBaseUrl();
  const dashboardUrl = `${baseUrl}/dashboard`;

  try {
    await brevoApi.sendTransacEmail({
      sender: {
        name: "Vitria",
        email: "noreply@vitria.cl"
      },
      to: [{
        email: data.agencyEmail,
        name: data.agencyName
      }],
      subject: `🎉 Nueva solicitud de cotización - ${data.projectName}`,
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1B5568; color: white; padding: 30px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 30px; }
            .highlight { background-color: #F5D35E; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .info-box { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .info-row { margin: 12px 0; }
            .label { font-weight: bold; color: #1B5568; }
            .button { display: inline-block; padding: 15px 30px; background-color: #1B5568; color: white !important; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 ¡Nueva Solicitud de Cotización!</h1>
            </div>
            <div class="content">
              <p>Hola equipo de <strong>${data.agencyName}</strong>,</p>
              
              <div class="highlight">
                <h2 style="margin-top: 0; color: #1B5568;">Un cliente está interesado en tus servicios</h2>
                <p style="margin-bottom: 0;">Has recibido una nueva solicitud de cotización a través de Vitria.</p>
              </div>
              
              <div class="info-box">
                <h3 style="color: #1B5568; margin-top: 0;">Información del Proyecto</h3>
                
                <div class="info-row">
                  <span class="label">Proyecto:</span> ${data.projectName}
                </div>
                
                <div class="info-row">
                  <span class="label">Descripción:</span>
                  <p style="margin: 8px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">${data.projectDescription}</p>
                </div>
                
                <div class="info-row">
                  <span class="label">Presupuesto estimado:</span> ${data.budgetRange}
                </div>
                
                <div class="info-row">
                  <span class="label">Categoría de servicio:</span> ${data.serviceCategory}
                </div>
              </div>
              
              <div class="info-box">
                <h3 style="color: #1B5568; margin-top: 0;">Información del Cliente</h3>
                
                <div class="info-row">
                  <span class="label">Nombre:</span> ${data.clientName}
                </div>
                
                <div class="info-row">
                  <span class="label">Email:</span> <a href="mailto:${data.clientEmail}">${data.clientEmail}</a>
                </div>
                
                ${data.clientPhone ? `
                <div class="info-row">
                  <span class="label">Teléfono:</span> <a href="tel:${data.clientPhone}">${data.clientPhone}</a>
                </div>
                ` : ''}
              </div>
              
              <div style="background-color: #E8F4F8; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <p style="margin: 0; font-size: 14px; color: #1B5568;"><strong>💡 Consejo:</strong> Los clientes que reciben respuesta en las primeras 24 horas tienen una tasa de conversión 3 veces mayor. ¡Responde rápido para aumentar tus posibilidades!</p>
              </div>
              
              <div style="text-align: center;">
                <a href="mailto:${data.clientEmail}" class="button">Contactar Cliente</a>
              </div>
              
              <div style="text-align: center; margin-top: 15px;">
                <a href="${dashboardUrl}" style="color: #1B5568; text-decoration: none; font-weight: bold;">Ver todas mis solicitudes en Dashboard →</a>
              </div>
              
              <p style="margin-top: 30px;">¡Mucho éxito con este proyecto!</p>
              
              <p>Saludos,<br>
              <strong>El equipo de Vitria</strong></p>
            </div>
            <div class="footer">
              <p>Este es un correo automático de Vitria Platform</p>
              <p>Solicitud ID: ${data.quoteId}</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
  } catch (error) {
    console.error('Error sending quote notification to agency:', error);
    throw error;
  }
}

interface QuoteConfirmationData {
  clientName: string;
  clientEmail: string;
  agencyName: string;
  projectName: string;
}

export async function sendQuoteConfirmationToClient(data: QuoteConfirmationData) {
  const baseUrl = getBaseUrl();
  const agenciesUrl = `${baseUrl}/agencias`;

  try {
    await brevoApi.sendTransacEmail({
      sender: {
        name: "Vitria",
        email: "noreply@vitria.cl"
      },
      to: [{
        email: data.clientEmail,
        name: data.clientName
      }],
      subject: `✅ Solicitud enviada a ${data.agencyName}`,
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #10B981; color: white; padding: 30px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 30px; }
            .success-box { background-color: #D1FAE5; border-left: 4px solid #10B981; padding: 20px; margin: 20px 0; }
            .info-box { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .button { display: inline-block; padding: 15px 30px; background-color: #1B5568; color: white !important; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px 5px; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ ¡Solicitud Enviada!</h1>
            </div>
            <div class="content">
              <p>Hola ${data.clientName},</p>
              
              <div class="success-box">
                <h2 style="margin-top: 0; color: #10B981;">Tu solicitud fue enviada exitosamente</h2>
                <p style="margin-bottom: 0;">Hemos notificado a <strong>${data.agencyName}</strong> sobre tu proyecto <strong>"${data.projectName}"</strong>.</p>
              </div>
              
              <div class="info-box">
                <h3 style="color: #1B5568; margin-top: 0;">¿Qué sigue?</h3>
                <ul style="line-height: 1.8;">
                  <li>La agencia recibirá tu información de contacto y los detalles de tu proyecto</li>
                  <li>Se pondrán en contacto contigo directamente en las próximas 24-48 horas</li>
                  <li>Podrás discutir los detalles del proyecto y recibir una cotización personalizada</li>
                </ul>
              </div>
              
              <div style="background-color: #FEF3C7; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #F59E0B;">
                <p style="margin: 0; font-size: 14px;"><strong>💡 Consejo:</strong> Mientras esperas, puedes explorar otras agencias en Vitria. Comparar opciones te ayudará a tomar la mejor decisión para tu proyecto.</p>
              </div>
              
              <div style="text-align: center;">
                <a href="${agenciesUrl}" class="button">Explorar Más Agencias</a>
              </div>
              
              <p style="margin-top: 30px;">Si tienes alguna pregunta, estamos aquí para ayudarte.</p>
              
              <p>Saludos,<br>
              <strong>El equipo de Vitria</strong></p>
            </div>
            <div class="footer">
              <p>Este es un correo automático de Vitria Platform</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
  } catch (error) {
    console.error('Error sending quote confirmation to client:', error);
    throw error;
  }
}

interface AdminQuoteNotificationData {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  projectName: string;
  projectDescription: string;
  budgetRange?: string;
  serviceCategory?: string;
  agencyName: string;
  agencyId: string;
  quoteId: string;
}

export async function sendQuoteNotificationToAdmin(data: AdminQuoteNotificationData) {
  const baseUrl = getBaseUrl();
  const adminQuoteUrl = `${baseUrl}/admin/cotizaciones`;

  try {
    await brevoApi.sendTransacEmail({
      sender: {
        name: "Vitria Platform",
        email: "noreply@vitria.cl"
      },
      to: [{
        email: getAdminEmail(),
        name: "Equipo Vitria"
      }],
      subject: `📊 Nueva cotización - ${data.clientName} → ${data.agencyName}`,
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1B5568; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; }
            .info-box { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #F5D35E; }
            .info-row { margin: 10px 0; }
            .label { font-weight: bold; color: #1B5568; display: inline-block; min-width: 120px; }
            .button { display: inline-block; padding: 12px 25px; background-color: #1B5568; color: white !important; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 Nueva Solicitud de Cotización</h1>
            </div>
            <div class="content">
              <p>Se ha generado una nueva solicitud de cotización en la plataforma:</p>
              
              <div class="info-box">
                <h3 style="color: #1B5568; margin-top: 0;">Información del Cliente</h3>
                
                <div class="info-row">
                  <span class="label">Nombre:</span> ${data.clientName}
                </div>
                
                <div class="info-row">
                  <span class="label">Email:</span> <a href="mailto:${data.clientEmail}">${data.clientEmail}</a>
                </div>
                
                ${data.clientPhone ? `
                <div class="info-row">
                  <span class="label">Teléfono:</span> <a href="tel:${data.clientPhone}">${data.clientPhone}</a>
                </div>
                ` : ''}
              </div>
              
              <div class="info-box">
                <h3 style="color: #1B5568; margin-top: 0;">Detalles del Proyecto</h3>
                
                <div class="info-row">
                  <span class="label">Proyecto:</span> <strong>${data.projectName}</strong>
                </div>
                
                <div class="info-row">
                  <span class="label">Descripción:</span>
                  <p style="margin: 8px 0; padding: 12px; background-color: #f9f9f9; border-radius: 4px; border-left: 3px solid #1B5568;">${data.projectDescription}</p>
                </div>
                
                ${data.budgetRange ? `
                <div class="info-row">
                  <span class="label">Presupuesto:</span> ${data.budgetRange}
                </div>
                ` : ''}
                
                ${data.serviceCategory ? `
                <div class="info-row">
                  <span class="label">Categoría:</span> ${data.serviceCategory}
                </div>
                ` : ''}
              </div>
              
              <div class="info-box">
                <h3 style="color: #1B5568; margin-top: 0;">Agencia Seleccionada</h3>
                
                <div class="info-row">
                  <span class="label">Agencia:</span> <strong>${data.agencyName}</strong>
                </div>
                
                <div class="info-row">
                  <span class="label">ID Agencia:</span> <code style="background-color: #f3f4f6; padding: 2px 6px; border-radius: 3px; font-size: 12px;">${data.agencyId}</code>
                </div>
                
                <div class="info-row">
                  <span class="label">ID Cotización:</span> <code style="background-color: #f3f4f6; padding: 2px 6px; border-radius: 3px; font-size: 12px;">${data.quoteId}</code>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 25px;">
                <a href="${adminQuoteUrl}" class="button">Ver en Panel de Admin</a>
              </div>
              
              <p style="text-align: center; color: #666; font-size: 13px; margin-top: 20px;">
                Esta cotización también ha sido enviada a la agencia
              </p>
            </div>
            <div class="footer">
              <p>Notificación automática de Vitria Platform</p>
              <p style="margin-top: 5px; color: #999;">Generada el ${new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
  } catch (error) {
    console.error('Error sending quote notification to admin:', error);
    throw error;
  }
}
