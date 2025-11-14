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
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  if (process.env.REPLIT_DEV_DOMAIN) {
    return `https://${process.env.REPLIT_DEV_DOMAIN}`;
  }
  
  if (process.env.NODE_ENV === 'production') {
    return 'https://vitria.cl';
  }
  
  return 'http://localhost:3000';
}

function getAdminEmail(): string {
  return process.env.ADMIN_EMAIL || 'contacto@scalelab.cl';
}

export async function sendAgencyReviewEmail(agencyData: AgencyData) {
  const baseUrl = getBaseUrl();
  const approveUrl = `${baseUrl}/admin/agencies/${agencyData.id}/approve`;
  const rejectUrl = `${baseUrl}/admin/agencies/${agencyData.id}/reject`;

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
                <a href="${approveUrl}" class="button approve">✓ Aprobar Agencia</a>
                <a href="${rejectUrl}" class="button reject">✗ Rechazar Agencia</a>
              </div>
              
              <p style="text-align: center; color: #666; font-size: 14px;">
                También puedes revisar esta agencia en el panel de administración.
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
