export default function PrivacidadPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-primary mb-8">Política de Privacidad</h1>
      
      <div className="prose prose-lg max-w-none text-dark/80 space-y-6">
        <p className="text-sm text-dark/60">
          Versión actualizada conforme a la Ley N° 19.628 y preparación para Ley N° 21.719
        </p>
        <p className="text-sm text-dark/60">
          Fecha de última actualización: 26 de noviembre de 2025
        </p>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">1. Información General</h2>
          <p>
            Vitria ("nosotros", "nuestro" o "la plataforma") se compromete a proteger la privacidad de todos los usuarios de nuestra plataforma. Esta Política de Privacidad describe cómo recopilamos, usamos y protegemos tu información personal, en cumplimiento de la Ley N° 19.628 sobre Protección de la Vida Privada actualmente vigente en Chile, y adoptando anticipadamente los estándares de la Ley N° 21.719.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">2. Responsable del Tratamiento de Datos</h2>
          <p>
            El responsable del banco de datos es Vitria.
          </p>
          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">Contacto para Consultas de Privacidad:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Email:</strong> contacto@vitria.cl</li>
            <li><strong>Canal:</strong> Formulario de contacto disponible en la plataforma.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">3. Datos que Recopilamos</h2>
          <p>
            Recopilamos los siguientes tipos de información, definidos como "Datos Personales" según el Art. 2 letra f) de la Ley N° 19.628:
          </p>
          
          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">3.1 Información de Cuenta</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Nombre completo.</li>
            <li>Dirección de correo electrónico.</li>
            <li>Contraseña (almacenada de forma encriptada).</li>
            <li>Tipo de cuenta (cliente o agencia).</li>
          </ul>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">3.2 Información de Agencias (Datos Comerciales)</h3>
          <p>
            Nombre de la agencia, descripción, ubicación, contacto (email, WhatsApp, web), portafolio y redes sociales.
          </p>
          <p className="mt-2 text-sm text-dark/70 italic">
            Nota: Conforme al Art. 4 de la Ley 19.628, los datos de personas jurídicas o datos comerciales de acceso público tienen un régimen de tratamiento diferenciado.
          </p>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">3.3 Información de Interacción</h3>
          <p>
            Solicitudes de cotización, reseñas, búsquedas y métricas de uso.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">4. Finalidad del Tratamiento</h2>
          <p>
            De conformidad con el principio de finalidad (Art. 9 Ley 19.628), utilizamos tus datos exclusivamente para:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Gestionar tu cuenta y la relación contractual.</li>
            <li>Facilitar la conexión comercial entre Clientes y Agencias (cotizaciones).</li>
            <li>Publicar el directorio de agencias.</li>
            <li>Gestionar reseñas y calidad del servicio.</li>
            <li>Cumplimiento de obligaciones legales y tributarias.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">5. Base Legal y Consentimiento</h2>
          <p>
            El tratamiento de tus datos personales se fundamenta principalmente en tu consentimiento expreso, libre e informado (Art. 4 Ley 19.628), el cual otorgas al registrarte y aceptar esta política.
          </p>
          <p className="mt-4">
            Adicionalmente, tratamos datos bajo las siguientes bases (en preparación a la Ley 21.719):
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Ejecución del contrato:</strong> Para prestar el servicio solicitado.</li>
            <li><strong>Interés legítimo:</strong> Para seguridad y mejora del servicio.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">6. Compartición de Información</h2>
          <p>
            Vitria no cede ni comunica tus datos a terceros sin tu consentimiento, salvo:
          </p>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">6.1 Funcionalidad del Servicio</h3>
          <p>
            Al solicitar una cotización, autorizas expresamente a Vitria a comunicar tus datos de contacto a la Agencia seleccionada para que esta pueda responder a tu solicitud.
          </p>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">6.2 Información Pública</h3>
          <p>
            Los datos que voluntariamente incluyas en tu perfil público de Agencia serán accesibles a cualquier usuario de internet.
          </p>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">6.3 Proveedores de Servicios (Encargados del Tratamiento)</h3>
          <p>
            Compartimos datos con proveedores tecnológicos (ej. Supabase, Brevo) que actúan como "Encargados del Tratamiento" bajo nuestras instrucciones, exclusivamente para prestar el servicio y con prohibición de uso propio.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">7. Seguridad de Datos</h2>
          <p>
            Cumplimos con la obligación de seguridad (Art. 11 Ley 19.628), implementando medidas como encriptación, HTTPS y control de accesos para proteger tus datos contra pérdida, acceso no autorizado o alteración.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">8. Tus Derechos (ARCO)</h2>
          <p>
            Conforme a la Ley N° 19.628 (Arts. 12 y siguientes), tienes derecho a:
          </p>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">8.1 Acceso e Información</h3>
          <p>
            Solicitar información sobre los datos relativos a tu persona, su procedencia y destinatario, el propósito del almacenamiento y la individualización de las personas u organismos a los cuales tus datos son transmitidos regularmente.
          </p>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">8.2 Rectificación</h3>
          <p>
            Solicitar la modificación de tus datos personales cuando sean erróneos, inexactos, equívocos o incompletos.
          </p>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">8.3 Cancelación (Eliminación)</h3>
          <p>
            Exigir la eliminación de tus datos cuando su almacenamiento carezca de fundamento legal o cuando hayan caducado, o cuando los hayas proporcionado voluntariamente y no desees continuar figurando en el registro.
          </p>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">8.4 Bloqueo</h3>
          <p>
            Solicitar la suspensión temporal de cualquier operación de tratamiento de tus datos.
          </p>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">8.5 Procedimiento para Ejercer Derechos</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Canal:</strong> Email a contacto@vitria.cl.</li>
            <li><strong>Plazo de Respuesta:</strong> Vitria responderá a la brevedad posible. Si bien la Ley 19.628 establece un plazo de 2 días hábiles para pronunciarse, nos comprometemos a gestionar tu solicitud de fondo en un plazo máximo de 10 días hábiles.</li>
            <li><strong>Gratuidad:</strong> El ejercicio de estos derechos es gratuito.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">9. Retención de Datos</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Conservamos tus datos mientras tu cuenta esté activa.</li>
            <li><strong>Datos Tributarios:</strong> Se conservan por 6 años según Código Tributario.</li>
            <li><strong>Eliminación:</strong> Al cerrar tu cuenta, tus datos personales serán eliminados o anonimizados, salvo aquellos que debamos conservar por obligación legal.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">10. Cookies</h2>
          <p>
            Utilizamos cookies esenciales para el funcionamiento técnico (sesión) y cookies de funcionalidad. No utilizamos cookies de terceros para venta de datos. Puedes gestionar las cookies desde tu navegador.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">11. Transferencias Internacionales</h2>
          <p>
            Utilizamos servicios de infraestructura en la nube (ej. servidores en EE.UU. o Europa). Al aceptar esta política, autorizas expresamente (Art. 4 Ley 19.628) la transferencia internacional de tus datos a estos proveedores, quienes cuentan con estándares de seguridad de nivel empresarial.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">12. Notificación de Brechas</h2>
          <p>
            En caso de vulneración de seguridad que afecte tus derechos, te notificaremos al correo registrado, indicando las medidas adoptadas, anticipándonos al estándar de la futura Ley 21.719.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">13. Reclamaciones y Resolución de Conflictos</h2>
          <p>
            Si consideras que hemos infringido tus derechos:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Contacto Directo:</strong> Escríbenos a contacto@vitria.cl para solucionar el problema.</li>
            <li><strong>Vía Judicial:</strong> Si no obtienes respuesta satisfactoria, la ley vigente (Art. 16 Ley 19.628) te faculta para recurrir al Juez de Letras en lo Civil de tu domicilio o del domicilio del responsable.</li>
            <li><strong>SERNAC:</strong> En tu calidad de consumidor, también puedes acudir al Servicio Nacional del Consumidor.</li>
          </ul>
          <p className="mt-4 text-sm text-dark/70 italic">
            Nota: La Agencia de Protección de Datos Personales (APDP) entrará en funciones fiscalizadoras en diciembre de 2026. Hasta esa fecha, la competencia corresponde a los Tribunales Ordinarios de Justicia.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">14. Cambios a esta Política</h2>
          <p>
            Podemos actualizar esta política. Te notificaremos de cambios sustanciales vía email o aviso en la plataforma. El uso continuado tras la notificación implica aceptación.
          </p>
        </section>

        <div className="bg-lilac/10 p-6 rounded-lg mt-8">
          <p className="text-sm text-dark/70">
            Esta política cumple con la Ley N° 19.628 sobre Protección de la Vida Privada y adopta anticipadamente los estándares de la Ley N° 21.719. 
            La Agencia de Protección de Datos Personales (APDP) será el organismo fiscalizador una vez entre en funciones en diciembre de 2026.
          </p>
        </div>
      </div>
    </div>
  );
}
