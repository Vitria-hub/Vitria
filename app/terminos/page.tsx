import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y Condiciones de Uso',
  description: 'Términos y condiciones de uso de Vitria, directorio de agencias en Chile. Conforme a la Ley N° 19.496 y normativa chilena vigente.',
  alternates: { canonical: '/terminos' },
};

export default function TerminosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-primary mb-8">Términos y Condiciones de Uso</h1>
      
      <div className="prose prose-lg max-w-none text-dark/80 space-y-6">
        <p className="text-sm text-dark/60">
          Versión actualizada conforme a la Ley N° 19.496 y normativa chilena vigente.
        </p>
        <p className="text-sm text-dark/60">
          Fecha de última actualización: 26 de noviembre de 2025
        </p>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">1. Aceptación de los Términos</h2>
          <p>
            Al acceder y utilizar la plataforma Vitria ("la Plataforma" o "el Servicio"), usted ("el Usuario") acepta expresamente los presentes Términos y Condiciones. Estos términos constituyen un contrato vinculante entre el Usuario y Vitria. Se recomienda leerlos detenidamente.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">2. Descripción del Servicio e Intermediación</h2>
          <p>
            Vitria opera como una plataforma de directorio y gestión que conecta a personas o empresas ("Clientes") con agencias de marketing y publicidad ("Agencias").
          </p>
          
          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">Declaración de Intermediación:</h3>
          <p>
            De conformidad con el artículo 43 de la Ley N° 19.496, Vitria actúa en calidad de proveedor intermediario en la prestación de servicios entre Clientes y Agencias. Si bien Vitria facilita la conexión, las Agencias son terceros independientes. No obstante, Vitria responderá directamente frente al Usuario consumidor por el cumplimiento de sus obligaciones como intermediario, sin perjuicio de su derecho a repetir contra el prestador final (Agencia) en caso de incumplimiento de este último.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">3. Registro y Cuentas</h2>
          
          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">3.1 Veracidad de la Información</h3>
          <p>
            El Usuario se obliga a proporcionar información fidedigna. La entrega de información falsa podrá resultar en la suspensión de la cuenta.
          </p>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">3.2 Seguridad</h3>
          <p>
            El Usuario es responsable de mantener la confidencialidad de sus credenciales. Vitria no será responsable por accesos no autorizados derivados de la negligencia del Usuario en el resguardo de su clave.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">4. Uso de la Plataforma y Prohibiciones</h2>
          <p>Queda estrictamente prohibido:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Publicar contenido que infrinja derechos de propiedad intelectual o industrial.</li>
            <li>Utilizar la plataforma para fines ilícitos o que atenten contra la moral y las buenas costumbres.</li>
            <li>Realizar "scraping" o extracción masiva de datos sin autorización.</li>
            <li>Publicar reseñas falsas o manipuladas.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">5. Contenido del Usuario y Licencia</h2>
          <p>
            El Usuario conserva los derechos sobre el contenido que publica (reseñas, portafolios), pero otorga a Vitria una licencia no exclusiva, gratuita y mundial para exhibir, reproducir y distribuir dicho contenido dentro de la plataforma para los fines del servicio.
          </p>
          <p className="mt-4">
            <strong>Responsabilidad:</strong> El Usuario declara que posee los derechos necesarios sobre el contenido que publica y libera a Vitria de responsabilidad por infracciones a terceros derivadas de dicho contenido.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">6. Planes Premium, Pagos y Facturación</h2>
          
          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">6.1 Tarifas y Condiciones</h3>
          <p>
            Las características específicas, precio y duración de los planes Premium serán informados de manera clara, veraz y oportuna antes de la contratación, en cumplimiento del artículo 3 de la Ley N° 19.496.
          </p>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">6.2 Documentos Tributarios</h3>
          <p>
            Conforme a la normativa del Servicio de Impuestos Internos (Resoluciones Ex. SII vigentes), Vitria emitirá y enviará la representación virtual de la Boleta Electrónica de Ventas y Servicios o Factura Electrónica al correo electrónico registrado por el Usuario. Es responsabilidad del Usuario mantener este correo actualizado.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">7. Derecho de Retracto (Artículo 3 bis Ley 19.496)</h2>
          
          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">7.1 Para Consumidores</h3>
          <p>
            En los contratos celebrados por medios electrónicos a través de Vitria (como la suscripción a planes Premium), el Usuario que tenga la calidad de consumidor final podrá ejercer su derecho de retracto dentro del plazo de 10 días contados desde la contratación del servicio y antes del inicio de su prestación.
          </p>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">7.2 Procedimiento</h3>
          <p>
            Para ejercer este derecho, el Usuario deberá contactar a contacto@vitria.cl. Vitria realizará la devolución de las sumas abonadas, sin retención de gastos, a la mayor brevedad posible y en un plazo máximo de 45 días siguientes a la comunicación del retracto.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">8. Reseñas y Moderación</h2>
          <p>
            Las reseñas deben basarse en experiencias de consumo reales. Vitria se reserva el derecho de moderar o eliminar reseñas que contengan lenguaje ofensivo, discriminatorio, imputaciones de delitos o que sean demostrablemente falsas, pero no intervendrá en disputas subjetivas sobre la calidad del servicio de la Agencia, salvo orden judicial.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">9. Limitación de Responsabilidad</h2>
          
          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">9.1 Alcance</h3>
          <p>
            Vitria realizará sus mejores esfuerzos para asegurar la disponibilidad técnica de la plataforma. Sin embargo, no garantiza una disponibilidad del 100% debido a posibles fallas técnicas, mantenimiento o fuerza mayor.
          </p>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">9.2 Responsabilidad del Intermediario</h3>
          <p>Conforme a la legislación chilena, Vitria no será responsable por:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Daños indirectos o lucro cesante que no sean consecuencia inmediata y directa de un incumplimiento de Vitria.</li>
            <li>La calidad intrínseca de los servicios de marketing prestados por las Agencias, salvo en lo que competa a la responsabilidad objetiva del intermediario establecida en la ley.</li>
            <li>Contenidos de sitios externos enlazados desde la plataforma.</li>
          </ul>
          <p className="mt-4 text-sm text-dark/70 italic">
            Nota: Se eliminan las cláusulas de exención absoluta de responsabilidad por considerarse abusivas según jurisprudencia (Rol N° 1077-2016 C.A. Santiago).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">10. Modificaciones a los Términos</h2>
          <p>
            Vitria podrá modificar estos términos. Toda modificación sustancial será notificada al Usuario con una anticipación razonable a través del correo electrónico o un aviso destacado en la plataforma.
          </p>
          <p className="mt-4">
            <strong>Opción de Término:</strong> Si el Usuario no está de acuerdo con las modificaciones, tendrá derecho a poner término al contrato y cerrar su cuenta sin penalización alguna antes de la entrada en vigencia de los nuevos términos. El silencio o uso continuado no se interpretará automáticamente como aceptación si las modificaciones imponen nuevas cargas onerosas o limitan derechos esenciales.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">11. Terminación del Servicio</h2>
          <p>
            Vitria podrá suspender o terminar la cuenta de un Usuario por incumplimiento grave de estos términos (ej. fraude, no pago). En caso de suspensión de cuentas pagadas, se notificará al Usuario indicando la causal, salvo que la notificación comprometa la seguridad de la plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">12. Protección de Datos Personales</h2>
          <p>
            El tratamiento de datos personales se regirá por la Ley N° 19.628 sobre Protección de la Vida Privada y, en lo pertinente, por la Ley N° 21.719 (una vez vigente). Vitria no comunicará datos personales a terceros sin consentimiento expreso del titular, salvo las excepciones legales o requerimiento judicial.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">13. Resolución de Conflictos y Jurisdicción</h2>
          
          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">13.1 Reclamos ante Vitria</h3>
          <p>
            El Usuario puede presentar reclamos directos a través de los canales de soporte. Vitria se compromete a responder en un plazo máximo de 10 días hábiles.
          </p>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">13.2 SERNAC</h3>
          <p>
            El Usuario consumidor tiene derecho a acudir al Servicio Nacional del Consumidor (SERNAC) para interponer reclamos o solicitar mediación.
          </p>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">13.3 Tribunales Competentes</h3>
          <p>Para cualquier controversia judicial:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Consumidores:</strong> Será competente el Juzgado de Policía Local de la comuna donde resida el consumidor o el del domicilio del proveedor, a elección del consumidor (Art. 50 A Ley 19.496).</li>
            <li><strong>Empresas (B2B):</strong> Para controversias entre Vitria y Usuarios que no sean consumidores finales, las partes fijan domicilio en la ciudad de Santiago y se someten a la jurisdicción de sus Tribunales Ordinarios de Justicia.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">14. Fuerza Mayor</h2>
          <p>
            Ninguna de las partes será responsable por el incumplimiento de sus obligaciones si este se debe a casos fortuitos o fuerza mayor (ej. desastres naturales, pandemias, actos de autoridad), conforme al artículo 45 del Código Civil chileno.
          </p>
        </section>

        <div className="bg-lilac/10 p-6 rounded-lg mt-8">
          <p className="text-sm text-dark/70">
            Al utilizar Vitria, confirmas que has leído, entendido y aceptado estos Términos y Condiciones de Uso, 
            así como nuestra Política de Privacidad.
          </p>
        </div>
      </div>
    </div>
  );
}
