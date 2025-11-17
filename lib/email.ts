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
  // In Replit dev environment, prioritize dev domain
  if (process.env.REPLIT_DEV_DOMAIN) {
    return `https://${process.env.REPLIT_DEV_DOMAIN}`;
  }
  
  // Otherwise use the configured site URL
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
  
  try {
    await brevoApi.sendTransacEmail({
      sender: { 
        name: "Vitria", 
        email: "noreply@vitria.cl" 
      },
      to: [{ 
        email: userEmail,
        name: userName
      }],
      subject: isAgency ? '¡Bienvenido a Vitria! Conecta con clientes en Chile' : '¡Bienvenido a Vitria! Encuentra tu agencia ideal',
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6; 
              color: #1a1a1a;
              background: linear-gradient(135deg, #1B5568 0%, #2980b9 100%);
              padding: 20px;
            }
            .email-wrapper { 
              max-width: 600px; 
              margin: 0 auto; 
              background: white;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 10px 40px rgba(0,0,0,0.15);
            }
            .header { 
              background: linear-gradient(135deg, #1B5568 0%, #2980b9 100%);
              padding: 40px 30px;
              text-align: center;
              position: relative;
            }
            .logo-container {
              background: white;
              width: 80px;
              height: 80px;
              border-radius: 50%;
              margin: 0 auto 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .header h1 { 
              color: white; 
              font-size: 28px;
              font-weight: 700;
              margin-bottom: 8px;
              text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header p {
              color: rgba(255,255,255,0.9);
              font-size: 16px;
            }
            .content { 
              padding: 40px 30px;
              background: white;
            }
            .greeting {
              font-size: 20px;
              color: #1B5568;
              font-weight: 600;
              margin-bottom: 20px;
            }
            .intro-text {
              font-size: 16px;
              color: #4a5568;
              line-height: 1.8;
              margin-bottom: 30px;
            }
            .mission-box {
              background: linear-gradient(135deg, #F5D35E 0%, #fde68a 100%);
              padding: 30px;
              border-radius: 12px;
              margin: 30px 0;
              border-left: 5px solid #1B5568;
            }
            .mission-box h2 {
              color: #1B5568;
              font-size: 22px;
              margin-bottom: 15px;
              font-weight: 700;
            }
            .mission-box p {
              color: #2d3748;
              font-size: 15px;
              line-height: 1.7;
            }
            .features {
              margin: 30px 0;
            }
            .feature-item {
              display: flex;
              align-items: start;
              margin-bottom: 20px;
              padding: 15px;
              background: #f7fafc;
              border-radius: 8px;
              transition: transform 0.2s;
            }
            .feature-icon {
              background: #1B5568;
              color: white;
              width: 40px;
              height: 40px;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 15px;
              flex-shrink: 0;
              font-weight: bold;
              font-size: 18px;
            }
            .feature-text h3 {
              color: #1B5568;
              font-size: 16px;
              margin-bottom: 5px;
              font-weight: 600;
            }
            .feature-text p {
              color: #4a5568;
              font-size: 14px;
              line-height: 1.5;
            }
            .cta-section {
              text-align: center;
              margin: 40px 0 30px;
            }
            .button {
              display: inline-block;
              padding: 16px 40px;
              background: linear-gradient(135deg, #1B5568 0%, #2980b9 100%);
              color: white;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              font-size: 16px;
              box-shadow: 0 4px 15px rgba(27,85,104,0.3);
              transition: transform 0.2s;
            }
            .secondary-button {
              display: inline-block;
              padding: 14px 30px;
              background: white;
              color: #1B5568;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              font-size: 14px;
              border: 2px solid #1B5568;
              margin: 10px;
            }
            .divider {
              height: 1px;
              background: linear-gradient(to right, transparent, #e2e8f0, transparent);
              margin: 30px 0;
            }
            .footer {
              background: #f7fafc;
              padding: 30px;
              text-align: center;
              border-top: 1px solid #e2e8f0;
            }
            .footer-text {
              color: #718096;
              font-size: 13px;
              margin-bottom: 15px;
            }
            .social-links {
              margin: 15px 0;
            }
            .social-link {
              display: inline-block;
              margin: 0 8px;
              color: #1B5568;
              text-decoration: none;
              font-size: 13px;
              font-weight: 500;
            }
            @media only screen and (max-width: 600px) {
              body { padding: 10px; }
              .header { padding: 30px 20px; }
              .header h1 { font-size: 24px; }
              .content { padding: 30px 20px; }
              .mission-box { padding: 20px; }
              .button { padding: 14px 30px; font-size: 15px; }
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="header">
              <div class="logo-container">
                <svg width="50" height="50" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="45" fill="#1B5568"/>
                  <circle cx="50" cy="35" r="12" fill="#F5D35E"/>
                  <circle cx="35" cy="60" r="10" fill="#F5D35E"/>
                  <circle cx="65" cy="60" r="10" fill="#F5D35E"/>
                  <rect x="32" y="55" width="36" height="4" rx="2" fill="#F5D35E"/>
                </svg>
              </div>
              <h1>¡Bienvenido a Vitria!</h1>
              <p>${isAgency ? 'Tu plataforma para conectar con clientes' : 'Encuentra la agencia perfecta para tu proyecto'}</p>
            </div>
            
            <div class="content">
              <div class="greeting">Hola ${userName} 👋</div>
              
              <p class="intro-text">
                ${isAgency 
                  ? 'Estamos emocionados de tenerte en Vitria. Acabas de unirte al directorio de agencias más completo de Chile, donde podrás conectar con clientes que buscan exactamente lo que tu agencia ofrece.'
                  : 'Nos alegra que te hayas unido a Vitria. Ahora tienes acceso al directorio más completo de agencias de marketing, branding y publicidad en Chile.'
                }
              </p>
              
              <div class="mission-box">
                <h2>Nuestra Misión</h2>
                <p>
                  Vitria nace con un propósito claro: <strong>fortalecer el ecosistema de marketing y publicidad en Chile</strong>. 
                  Creemos que las mejores agencias merecen visibilidad, y los mejores proyectos merecen encontrar al partner ideal. 
                  Somos el puente que conecta talento creativo con oportunidades reales.
                </p>
              </div>
              
              <div class="features">
                <h2 style="color: #1B5568; font-size: 20px; margin-bottom: 20px; font-weight: 700;">
                  ${isAgency ? '¿Qué puedes hacer en Vitria?' : '¿Por qué elegir Vitria?'}
                </h2>
                
                ${isAgency ? `
                <div class="feature-item">
                  <div class="feature-icon">🎯</div>
                  <div class="feature-text">
                    <h3>Visibilidad Instantánea</h3>
                    <p>Tu agencia será visible para cientos de clientes potenciales que buscan servicios especializados cada día.</p>
                  </div>
                </div>
                
                <div class="feature-item">
                  <div class="feature-icon">📊</div>
                  <div class="feature-text">
                    <h3>Analytics Detallado</h3>
                    <p>Accede a métricas en tiempo real sobre las visitas a tu perfil y el interés de clientes potenciales.</p>
                  </div>
                </div>
                
                <div class="feature-item">
                  <div class="feature-icon">⭐</div>
                  <div class="feature-text">
                    <h3>Reputación Verificada</h3>
                    <p>Construye tu reputación con reseñas de clientes reales y destaca en tu categoría.</p>
                  </div>
                </div>
                
                <div class="feature-item">
                  <div class="feature-icon">🚀</div>
                  <div class="feature-text">
                    <h3>Crecimiento Sostenible</h3>
                    <p>Recibe contactos calificados de clientes que realmente necesitan tus servicios.</p>
                  </div>
                </div>
                ` : `
                <div class="feature-item">
                  <div class="feature-icon">🔍</div>
                  <div class="feature-text">
                    <h3>Búsqueda Especializada</h3>
                    <p>Filtra por categoría, ubicación y servicios para encontrar la agencia perfecta para tu proyecto.</p>
                  </div>
                </div>
                
                <div class="feature-item">
                  <div class="feature-icon">✨</div>
                  <div class="feature-text">
                    <h3>Agencias Verificadas</h3>
                    <p>Todas las agencias están cuidadosamente verificadas para garantizar calidad y profesionalismo.</p>
                  </div>
                </div>
                
                <div class="feature-item">
                  <div class="feature-icon">💬</div>
                  <div class="feature-text">
                    <h3>Reseñas Reales</h3>
                    <p>Lee experiencias de otros clientes para tomar decisiones informadas y seguras.</p>
                  </div>
                </div>
                
                <div class="feature-item">
                  <div class="feature-icon">🎨</div>
                  <div class="feature-text">
                    <h3>Portafolios Completos</h3>
                    <p>Explora trabajos anteriores y conoce el estilo de cada agencia antes de contactar.</p>
                  </div>
                </div>
                `}
              </div>
              
              <div class="divider"></div>
              
              <div class="cta-section">
                <p style="color: #4a5568; margin-bottom: 20px; font-size: 15px;">
                  ${isAgency 
                    ? '¿Listo para empezar? Completa tu perfil y comienza a recibir contactos.'
                    : '¿Listo para encontrar tu agencia ideal?'
                  }
                </p>
                <a href="${dashboardUrl}" class="button">
                  ${isAgency ? 'Ir a Mi Panel' : 'Explorar Mi Dashboard'}
                </a>
                <br>
                <a href="${exploreUrl}" class="secondary-button">
                  ${isAgency ? 'Ver Otras Agencias' : 'Explorar Agencias'}
                </a>
              </div>
              
              <div class="divider"></div>
              
              <p style="color: #4a5568; font-size: 14px; line-height: 1.7; margin-top: 30px;">
                Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos. 
                Estamos aquí para hacer que tu experiencia en Vitria sea excepcional.
              </p>
              
              <p style="color: #1B5568; font-weight: 600; margin-top: 25px; font-size: 15px;">
                ¡Bienvenido a la comunidad!<br>
                <span style="color: #4a5568; font-weight: 400;">El equipo de Vitria</span>
              </p>
            </div>
            
            <div class="footer">
              <p class="footer-text">
                Este correo fue enviado por Vitria<br>
                El directorio de agencias líder en Chile
              </p>
              <div class="social-links">
                <a href="${baseUrl}" class="social-link">Visitar Vitria</a>
                <span style="color: #cbd5e0;">•</span>
                <a href="${baseUrl}/blog" class="social-link">Blog</a>
                <span style="color: #cbd5e0;">•</span>
                <a href="${baseUrl}/agencias" class="social-link">Agencias</a>
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
