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
            .approve { background-color: #10B981; color: white !important; }
            .reject { background-color: #EF4444; color: white !important; }
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
                  <span class="label">WhatsApp:</span> ${agencyData.phone}
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
                <a href="${reviewUrl}" class="button approve" style="background-color: #1B5568; color: white !important;">Revisar Agencia</a>
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
  const baseUrl = getBaseUrl();
  
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
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700;800&display=swap');
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
            .logo-container {
              text-align: center;
              margin-bottom: 25px;
              position: relative;
              z-index: 1;
            }
            .logo-table {
              margin: 0 auto;
              background: white;
              border-radius: 20px;
              padding: 15px;
              box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            }
            .logo-cell {
              width: 27px;
              height: 27px;
              border-radius: 6px;
            }
            .hero-title { 
              color: white; 
              font-size: 36px;
              font-weight: 800;
              margin-bottom: 12px;
              position: relative;
              z-index: 1;
            }
            .hero-subtitle {
              color: #F5D35E;
              font-size: 18px;
              font-weight: 600;
              position: relative;
              z-index: 1;
            }
            .accent-bar {
              height: 6px;
              background: linear-gradient(90deg, #F5D35E 0%, #fde047 100%);
            }
            .content { 
              padding: 40px;
              background: white;
            }
            .greeting {
              font-size: 24px;
              color: #1B5568;
              font-weight: 700;
              margin-bottom: 20px;
              text-align: center;
            }
            .intro-text {
              font-size: 16px;
              color: #4a5568;
              line-height: 1.7;
              text-align: center;
              margin-bottom: 30px;
            }
            .highlight-box {
              background: linear-gradient(135deg, #F5D35E 0%, #fbbf24 100%);
              padding: 25px 30px;
              border-radius: 12px;
              margin: 25px 0;
              text-align: center;
            }
            .highlight-box h2 {
              color: #1B5568;
              font-size: 20px;
              margin-bottom: 12px;
              font-weight: 800;
            }
            .highlight-box p {
              color: #1f2937;
              font-size: 15px;
              line-height: 1.7;
            }
            .steps-section {
              margin: 30px 0;
            }
            .section-title {
              color: #1B5568;
              font-size: 18px;
              margin-bottom: 20px;
              font-weight: 700;
              text-align: center;
            }
            .step-item {
              background: #f8fafc;
              border-left: 4px solid #1B5568;
              padding: 15px 20px;
              margin-bottom: 15px;
              border-radius: 8px;
            }
            .step-text {
              color: #4a5568;
              font-size: 15px;
              line-height: 1.5;
            }
            .info-box {
              background: #f0f9ff;
              border-left: 4px solid #1B5568;
              padding: 18px 20px;
              border-radius: 8px;
              margin: 25px 0;
            }
            .info-box p {
              color: #1B5568;
              font-size: 15px;
              margin: 0;
            }
            .signature {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              text-align: center;
            }
            .signature p {
              color: #4a5568;
              font-size: 15px;
            }
            .signature strong {
              color: #1B5568;
            }
            .footer {
              background: #1B5568;
              padding: 30px 40px;
              text-align: center;
            }
            .footer-logo {
              margin-bottom: 15px;
            }
            .footer-text {
              color: rgba(255,255,255,0.8);
              font-size: 14px;
              margin-bottom: 15px;
            }
            .footer-links {
              margin: 15px 0;
            }
            .footer-link {
              display: inline-block;
              margin: 0 10px;
              color: #F5D35E !important;
              text-decoration: none;
              font-size: 14px;
              font-weight: 600;
            }
            .copyright {
              color: rgba(255,255,255,0.5);
              font-size: 12px;
              margin-top: 15px;
            }
            @media only screen and (max-width: 600px) {
              body { padding: 0; }
              .hero-banner { padding: 35px 25px; }
              .hero-title { font-size: 28px; }
              .content { padding: 30px 25px; }
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="hero-banner">
              <div class="logo-container">
                <table class="logo-table" cellpadding="0" cellspacing="3" border="0">
                  <tr>
                    <td class="logo-cell" style="background-color: #1B5568;"></td>
                    <td class="logo-cell" style="background-color: #6F9CEB;"></td>
                  </tr>
                  <tr>
                    <td class="logo-cell" style="background-color: #64D5C3;"></td>
                    <td class="logo-cell" style="background-color: #F5D35E;"></td>
                  </tr>
                </table>
              </div>
              <h1 class="hero-title">¡Gracias por registrarte!</h1>
              <p class="hero-subtitle">Tu agencia está en proceso de revisión</p>
            </div>
            
            <div class="accent-bar"></div>
            
            <div class="content">
              <div class="greeting">Hola ${ownerName} 👋</div>
              
              <p class="intro-text">
                Hemos recibido el registro de <strong>${agencyName}</strong> en Vitria.
              </p>
              
              <div class="highlight-box">
                <h2>⏳ Estás en nuestra lista de espera</h2>
                <p>Nuestro equipo está revisando tu solicitud cuidadosamente para asegurar la calidad de nuestra plataforma.</p>
              </div>
              
              <div class="steps-section">
                <h3 class="section-title">¿Qué sigue?</h3>
                
                <div class="step-item">
                  <div class="step-text"><strong>1.</strong> Revisaremos la información de tu agencia</div>
                </div>
                
                <div class="step-item">
                  <div class="step-text"><strong>2.</strong> Te notificaremos por email cuando tu agencia sea aprobada</div>
                </div>
                
                <div class="step-item">
                  <div class="step-text"><strong>3.</strong> Una vez aprobada, tu agencia será visible para todos los usuarios de Vitria</div>
                </div>
              </div>
              
              <div class="info-box">
                <p>⏱️ Este proceso generalmente toma entre <strong>24-48 horas</strong>. Te mantendremos informado del progreso.</p>
              </div>
              
              <div class="signature">
                <p>Si tienes alguna pregunta, no dudes en contactarnos. 💙</p>
                <p style="margin-top: 15px;"><strong style="color: #1B5568;">— El equipo de Vitria</strong></p>
              </div>
            </div>
            
            <div class="footer">
              <div class="footer-logo">
                <table cellpadding="0" cellspacing="2" border="0" style="margin: 0 auto;">
                  <tr>
                    <td style="width: 18px; height: 18px; border-radius: 4px; background-color: #1B5568;"></td>
                    <td style="width: 18px; height: 18px; border-radius: 4px; background-color: #6F9CEB;"></td>
                  </tr>
                  <tr>
                    <td style="width: 18px; height: 18px; border-radius: 4px; background-color: #64D5C3;"></td>
                    <td style="width: 18px; height: 18px; border-radius: 4px; background-color: #F5D35E;"></td>
                  </tr>
                </table>
              </div>
              <p class="footer-text">Conectamos agencias con clientes en Chile</p>
              <div class="footer-links">
                <a href="${baseUrl}" class="footer-link">Inicio</a>
                <span style="color: rgba(255,255,255,0.4);">•</span>
                <a href="${baseUrl}/agencias" class="footer-link">Agencias</a>
              </div>
              <p class="copyright">© ${new Date().getFullYear()} Vitria. Todos los derechos reservados.</p>
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
      subject: `🎉 ¡Tu agencia ${agencyName} ha sido aprobada!`,
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700;800&display=swap');
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
              background: linear-gradient(135deg, #10B981 0%, #059669 100%);
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
              background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
              border-radius: 50%;
            }
            .logo-container {
              text-align: center;
              margin-bottom: 25px;
              position: relative;
              z-index: 1;
            }
            .logo-table {
              margin: 0 auto;
              background: white;
              border-radius: 20px;
              padding: 15px;
              box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            }
            .logo-cell {
              width: 27px;
              height: 27px;
              border-radius: 6px;
            }
            .hero-title { 
              color: white; 
              font-size: 36px;
              font-weight: 800;
              margin-bottom: 12px;
              position: relative;
              z-index: 1;
            }
            .hero-subtitle {
              color: rgba(255,255,255,0.95);
              font-size: 18px;
              font-weight: 600;
              position: relative;
              z-index: 1;
            }
            .accent-bar {
              height: 6px;
              background: linear-gradient(90deg, #F5D35E 0%, #fde047 100%);
            }
            .content { 
              padding: 40px;
              background: white;
            }
            .greeting {
              font-size: 24px;
              color: #1B5568;
              font-weight: 700;
              margin-bottom: 20px;
              text-align: center;
            }
            .success-box {
              background: linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%);
              padding: 25px 30px;
              border-radius: 12px;
              margin: 25px 0;
              border-left: 5px solid #10B981;
              text-align: center;
            }
            .success-box h2 {
              color: #065F46;
              font-size: 20px;
              margin-bottom: 12px;
              font-weight: 800;
            }
            .success-box p {
              color: #047857;
              font-size: 15px;
              line-height: 1.7;
            }
            .features-section {
              margin: 30px 0;
            }
            .section-title {
              color: #1B5568;
              font-size: 18px;
              margin-bottom: 20px;
              font-weight: 700;
              text-align: center;
            }
            .feature-item {
              background: #f8fafc;
              border-left: 4px solid #10B981;
              padding: 15px 20px;
              margin-bottom: 12px;
              border-radius: 8px;
            }
            .feature-text {
              color: #4a5568;
              font-size: 15px;
              line-height: 1.5;
            }
            .cta-section {
              text-align: center;
              margin: 35px 0 25px;
            }
            .cta-text {
              color: #1B5568;
              font-size: 18px;
              font-weight: 700;
              margin-bottom: 20px;
            }
            .button-primary {
              display: inline-block;
              padding: 16px 40px;
              background: linear-gradient(135deg, #1B5568 0%, #134551 100%);
              color: #ffffff !important;
              text-decoration: none;
              border-radius: 12px;
              font-weight: 700;
              font-size: 16px;
              box-shadow: 0 6px 20px rgba(27,85,104,0.35);
            }
            .signature {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              text-align: center;
            }
            .signature p {
              color: #4a5568;
              font-size: 15px;
            }
            .signature strong {
              color: #1B5568;
            }
            .footer {
              background: #1B5568;
              padding: 30px 40px;
              text-align: center;
            }
            .footer-logo {
              margin-bottom: 15px;
            }
            .footer-text {
              color: rgba(255,255,255,0.8);
              font-size: 14px;
              margin-bottom: 15px;
            }
            .footer-links {
              margin: 15px 0;
            }
            .footer-link {
              display: inline-block;
              margin: 0 10px;
              color: #F5D35E !important;
              text-decoration: none;
              font-size: 14px;
              font-weight: 600;
            }
            .copyright {
              color: rgba(255,255,255,0.5);
              font-size: 12px;
              margin-top: 15px;
            }
            @media only screen and (max-width: 600px) {
              body { padding: 0; }
              .hero-banner { padding: 35px 25px; }
              .hero-title { font-size: 28px; }
              .content { padding: 30px 25px; }
              .button-primary { padding: 14px 35px; }
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="hero-banner">
              <div class="logo-container">
                <table class="logo-table" cellpadding="0" cellspacing="3" border="0">
                  <tr>
                    <td class="logo-cell" style="background-color: #1B5568;"></td>
                    <td class="logo-cell" style="background-color: #6F9CEB;"></td>
                  </tr>
                  <tr>
                    <td class="logo-cell" style="background-color: #64D5C3;"></td>
                    <td class="logo-cell" style="background-color: #F5D35E;"></td>
                  </tr>
                </table>
              </div>
              <h1 class="hero-title">🎉 ¡Felicitaciones!</h1>
              <p class="hero-subtitle">Tu agencia ya está en vivo</p>
            </div>
            
            <div class="accent-bar"></div>
            
            <div class="content">
              <div class="greeting">Hola ${ownerName} 👋</div>
              
              <div class="success-box">
                <h2>✅ Tu agencia ha sido aprobada</h2>
                <p><strong>${agencyName}</strong> ya está visible en Vitria para todos los usuarios que buscan servicios de marketing y publicidad.</p>
              </div>
              
              <div class="features-section">
                <h3 class="section-title">¿Qué puedes hacer ahora?</h3>
                
                <div class="feature-item">
                  <div class="feature-text">🔍 Tu agencia aparecerá en los resultados de búsqueda</div>
                </div>
                
                <div class="feature-item">
                  <div class="feature-text">👀 Los clientes potenciales podrán ver tu perfil completo</div>
                </div>
                
                <div class="feature-item">
                  <div class="feature-text">📩 Comenzarás a recibir contactos interesados en tus servicios</div>
                </div>
                
                <div class="feature-item">
                  <div class="feature-text">✏️ Puedes actualizar tu perfil en cualquier momento</div>
                </div>
              </div>
              
              <div class="cta-section">
                <p class="cta-text">¡Ve cómo luce tu agencia en vivo!</p>
                <a href="${agencyUrl}" class="button-primary">Ver mi Agencia en Vitria</a>
              </div>
              
              <div class="signature">
                <p>Te deseamos mucho éxito en Vitria. 💙</p>
                <p style="margin-top: 15px;"><strong style="color: #1B5568;">— El equipo de Vitria</strong></p>
              </div>
            </div>
            
            <div class="footer">
              <div class="footer-logo">
                <table cellpadding="0" cellspacing="2" border="0" style="margin: 0 auto;">
                  <tr>
                    <td style="width: 18px; height: 18px; border-radius: 4px; background-color: #1B5568;"></td>
                    <td style="width: 18px; height: 18px; border-radius: 4px; background-color: #6F9CEB;"></td>
                  </tr>
                  <tr>
                    <td style="width: 18px; height: 18px; border-radius: 4px; background-color: #64D5C3;"></td>
                    <td style="width: 18px; height: 18px; border-radius: 4px; background-color: #F5D35E;"></td>
                  </tr>
                </table>
              </div>
              <p class="footer-text">Conectamos agencias con clientes en Chile</p>
              <div class="footer-links">
                <a href="${baseUrl}" class="footer-link">Inicio</a>
                <span style="color: rgba(255,255,255,0.4);">•</span>
                <a href="${baseUrl}/agencias" class="footer-link">Agencias</a>
              </div>
              <p class="copyright">© ${new Date().getFullYear()} Vitria. Todos los derechos reservados.</p>
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

export async function sendWelcomeEmail(userEmail: string, userName: string) {
  const baseUrl = getBaseUrl();
  const exploreUrl = `${baseUrl}/agencias`;
  
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
      subject: '✨ ¡Bienvenido a Vitria! La comunidad de agencias de Chile',
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700;800&display=swap');
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
            .logo-container {
              text-align: center;
              margin-bottom: 25px;
              position: relative;
              z-index: 1;
            }
            .logo-table {
              margin: 0 auto;
              background: white;
              border-radius: 20px;
              padding: 15px;
              box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            }
            .logo-cell {
              width: 27px;
              height: 27px;
              border-radius: 6px;
            }
            .hero-title { 
              color: white; 
              font-size: 36px;
              font-weight: 800;
              margin-bottom: 12px;
              position: relative;
              z-index: 1;
            }
            .hero-subtitle {
              color: #F5D35E;
              font-size: 18px;
              font-weight: 600;
              position: relative;
              z-index: 1;
            }
            .accent-bar {
              height: 6px;
              background: linear-gradient(90deg, #F5D35E 0%, #fde047 100%);
            }
            .content { 
              padding: 40px;
              background: white;
            }
            .greeting {
              font-size: 24px;
              color: #1B5568;
              font-weight: 700;
              margin-bottom: 20px;
              text-align: center;
            }
            .mission-box {
              background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
              border-left: 5px solid #F5D35E;
              padding: 30px;
              border-radius: 12px;
              margin: 25px 0;
            }
            .mission-title {
              color: #1B5568;
              font-size: 20px;
              font-weight: 800;
              margin-bottom: 15px;
            }
            .mission-text {
              color: #4a5568;
              font-size: 16px;
              line-height: 1.8;
            }
            .mission-text strong {
              color: #1B5568;
            }
            .community-highlight {
              background: linear-gradient(135deg, #F5D35E 0%, #fbbf24 100%);
              padding: 25px 30px;
              border-radius: 12px;
              margin: 30px 0;
              text-align: center;
            }
            .community-text {
              color: #1B5568;
              font-size: 18px;
              font-weight: 700;
              line-height: 1.6;
            }
            .cta-section {
              text-align: center;
              margin: 35px 0 25px;
            }
            .button-primary {
              display: inline-block;
              padding: 16px 40px;
              background: linear-gradient(135deg, #1B5568 0%, #134551 100%);
              color: #ffffff !important;
              text-decoration: none;
              border-radius: 12px;
              font-weight: 700;
              font-size: 16px;
              box-shadow: 0 6px 20px rgba(27,85,104,0.35);
            }
            .closing-text {
              color: #4a5568;
              font-size: 15px;
              line-height: 1.7;
              margin: 30px 0 20px;
              text-align: center;
            }
            .signature {
              color: #1B5568;
              font-weight: 700;
              text-align: center;
              font-size: 16px;
            }
            .footer {
              background: #1B5568;
              padding: 30px 40px;
              text-align: center;
            }
            .footer-logo {
              margin-bottom: 15px;
            }
            .footer-text {
              color: rgba(255,255,255,0.8);
              font-size: 14px;
              margin-bottom: 15px;
            }
            .footer-links {
              margin: 15px 0;
            }
            .footer-link {
              display: inline-block;
              margin: 0 10px;
              color: #F5D35E !important;
              text-decoration: none;
              font-size: 14px;
              font-weight: 600;
            }
            .copyright {
              color: rgba(255,255,255,0.5);
              font-size: 12px;
              margin-top: 15px;
            }
            @media only screen and (max-width: 600px) {
              body { padding: 0; }
              .hero-banner { padding: 35px 25px; }
              .hero-title { font-size: 28px; }
              .content { padding: 30px 25px; }
              .mission-box { padding: 20px; }
              .button-primary { padding: 14px 35px; }
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="hero-banner">
              <div class="logo-container">
                <table class="logo-table" cellpadding="0" cellspacing="3" border="0">
                  <tr>
                    <td class="logo-cell" style="background-color: #1B5568;"></td>
                    <td class="logo-cell" style="background-color: #6F9CEB;"></td>
                  </tr>
                  <tr>
                    <td class="logo-cell" style="background-color: #64D5C3;"></td>
                    <td class="logo-cell" style="background-color: #F5D35E;"></td>
                  </tr>
                </table>
              </div>
              <h1 class="hero-title">¡Bienvenido a Vitria!</h1>
              <p class="hero-subtitle">La comunidad de agencias de Chile 🇨🇱</p>
            </div>
            
            <div class="accent-bar"></div>
            
            <div class="content">
              <div class="greeting">Hola ${displayName} 👋</div>
              
              <div class="mission-box">
                <div class="mission-title">💡 ¿Por qué nació Vitria?</div>
                <p class="mission-text">
                  <strong>A las agencias les cuesta encontrar clientes cualificados. A los clientes les cuesta encontrar agencias confiables.</strong>
                </p>
                <p class="mission-text" style="margin-top: 15px;">
                  Creamos esta plataforma para ser ese puente: un espacio donde todas las agencias chilenas —grandes, pequeñas, especializadas o multidisciplinarias— puedan <strong>mostrar su trabajo real y conectar con quienes realmente necesitan sus servicios</strong>.
                </p>
              </div>
              
              <div class="community-highlight">
                <p class="community-text">
                  Creamos Comunidad, No Solo Listados ❤️
                </p>
              </div>
              
              <p class="mission-text" style="text-align: center;">
                Nuestro objetivo es construir una <strong>comunidad donde todos crecemos juntos</strong>: agencias que encuentran oportunidades, clientes que toman decisiones con información transparente, y un ecosistema más fuerte para todos.
              </p>
              
              <div class="cta-section">
                <a href="${exploreUrl}" class="button-primary">
                  Explorar Agencias
                </a>
              </div>
              
              <p class="closing-text">
                Si tienes alguna pregunta, estamos aquí para ayudarte. 💙
              </p>
              
              <p class="signature">
                ¡Bienvenido a la comunidad!<br>
                <span style="color: #4a5568; font-weight: 400; font-size: 14px;">— El equipo de Vitria</span>
              </p>
            </div>
            
            <div class="footer">
              <div class="footer-logo">
                <table cellpadding="0" cellspacing="2" border="0" style="margin: 0 auto;">
                  <tr>
                    <td style="width: 18px; height: 18px; border-radius: 4px; background-color: #1B5568;"></td>
                    <td style="width: 18px; height: 18px; border-radius: 4px; background-color: #6F9CEB;"></td>
                  </tr>
                  <tr>
                    <td style="width: 18px; height: 18px; border-radius: 4px; background-color: #64D5C3;"></td>
                    <td style="width: 18px; height: 18px; border-radius: 4px; background-color: #F5D35E;"></td>
                  </tr>
                </table>
              </div>
              <p class="footer-text">Conectamos agencias con clientes en Chile</p>
              <div class="footer-links">
                <a href="${baseUrl}" class="footer-link">Inicio</a>
                <span style="color: rgba(255,255,255,0.4);">•</span>
                <a href="${baseUrl}/agencias" class="footer-link">Agencias</a>
              </div>
              <p class="copyright">© ${new Date().getFullYear()} Vitria. Todos los derechos reservados.</p>
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
                  <span class="label">WhatsApp:</span> <a href="tel:${data.clientPhone}">${data.clientPhone}</a>
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
                  <span class="label">WhatsApp:</span> <a href="tel:${data.clientPhone}">${data.clientPhone}</a>
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
