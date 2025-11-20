export default function PrivacidadPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-primary mb-8">Política de Privacidad</h1>
      
      <div className="prose prose-lg max-w-none text-dark/80 space-y-6">
        <p className="text-sm text-dark/60">
          Última actualización: 18 de noviembre de 2025
        </p>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">1. Información General</h2>
          <p>
            Vitria ("nosotros", "nuestro" o "la plataforma") se compromete a proteger la privacidad de todos los usuarios de nuestra plataforma de directorio de agencias de marketing en Chile. Esta Política de Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos tu información personal de acuerdo con la Ley N° 21.719 sobre Protección de Datos Personales de Chile.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">2. Responsable del Tratamiento de Datos</h2>
          <p>
            El responsable del tratamiento de tus datos personales es Vitria, una plataforma de directorio operando en Chile.
          </p>
          <p className="mt-4">
            <strong>Contacto para Consultas de Privacidad:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Email: privacidad@vitria.cl (consultas sobre protección de datos)</li>
            <li>Formulario de contacto disponible en la plataforma</li>
            <li>Tiempo de respuesta: Máximo 30 días hábiles según Ley 21.719</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">3. Datos que Recopilamos</h2>
          <p>Recopilamos los siguientes tipos de información:</p>
          
          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">3.1 Información de Cuenta</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Nombre completo</li>
            <li>Dirección de correo electrónico</li>
            <li>Contraseña (encriptada)</li>
            <li>Tipo de cuenta (cliente o agencia)</li>
          </ul>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">3.2 Información de Agencias</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Nombre de la agencia</li>
            <li>Descripción de servicios</li>
            <li>Ubicación (ciudad y región)</li>
            <li>Información de contacto (email, WhatsApp, sitio web)</li>
            <li>Servicios ofrecidos y especialidades técnicas</li>
            <li>Portafolio de trabajos</li>
            <li>Redes sociales</li>
          </ul>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">3.3 Información de Interacción</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Solicitudes de cotización enviadas y recibidas</li>
            <li>Reseñas y calificaciones</li>
            <li>Búsquedas realizadas en la plataforma</li>
            <li>Visualizaciones de perfiles de agencias</li>
            <li>Clics en información de contacto</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">4. Finalidad del Tratamiento</h2>
          <p>Utilizamos tu información personal para los siguientes propósitos:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Crear y gestionar tu cuenta en la plataforma</li>
            <li>Facilitar la conexión entre clientes y agencias de marketing</li>
            <li>Procesar y gestionar solicitudes de cotización</li>
            <li>Mostrar información de agencias en el directorio público</li>
            <li>Permitir la publicación y gestión de reseñas</li>
            <li>Generar analíticas para agencias sobre el rendimiento de sus perfiles</li>
            <li>Mejorar nuestros servicios y experiencia de usuario</li>
            <li>Enviar comunicaciones relacionadas con el servicio (notificaciones de cotizaciones, mensajes del sistema)</li>
            <li>Cumplir con obligaciones legales</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">5. Base Legal para el Tratamiento</h2>
          <p>El tratamiento de tus datos personales se basa en:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Consentimiento:</strong> Al registrarte y aceptar esta política, consientes el tratamiento de tus datos</li>
            <li><strong>Ejecución de contrato:</strong> Para proporcionar los servicios de la plataforma</li>
            <li><strong>Interés legítimo:</strong> Para mejorar nuestros servicios y prevenir fraudes</li>
            <li><strong>Obligación legal:</strong> Cuando sea requerido por la legislación chilena</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">6. Compartición de Información</h2>
          <p>Tu información personal puede ser compartida con:</p>
          
          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">6.1 Información Pública</h3>
          <p>
            La información de perfiles de agencias (nombre, descripción, ubicación, servicios, portafolio, reseñas) es visible públicamente en nuestro directorio. Esta es una característica esencial de nuestro servicio.
          </p>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">6.2 Solicitudes de Cotización</h3>
          <p>
            Cuando un cliente envía una solicitud de cotización, compartimos su nombre y correo electrónico con la agencia seleccionada para facilitar la comunicación.
          </p>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">6.3 Proveedores de Servicios</h3>
          <p>
            Utilizamos proveedores externos para servicios como:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Almacenamiento de bases de datos (Supabase)</li>
            <li>Envío de correos electrónicos transaccionales (Brevo)</li>
            <li>Almacenamiento de archivos (imágenes, logos)</li>
          </ul>
          <p className="mt-2">
            Estos proveedores tienen acceso limitado a tu información solo para cumplir con sus funciones.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">7. Seguridad de Datos</h2>
          <p>
            Implementamos medidas técnicas y organizativas apropiadas para proteger tus datos personales:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Encriptación de contraseñas</li>
            <li>Conexiones seguras HTTPS</li>
            <li>Control de acceso basado en roles</li>
            <li>Almacenamiento en servidores seguros</li>
            <li>Monitoreo regular de vulnerabilidades</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">8. Tus Derechos (ARCO-P)</h2>
          <p>De acuerdo con la Ley 21.719, tienes los siguientes derechos:</p>
          
          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">8.1 Derecho de Acceso</h3>
          <p>
            Puedes solicitar información sobre qué datos personales procesamos, para qué fines, quién los recibe y cuánto tiempo los conservamos.
          </p>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">8.2 Derecho de Rectificación</h3>
          <p>
            Puedes solicitar la corrección de datos inexactos, incompletos o desactualizados. La mayoría de tus datos puedes actualizarlos directamente desde tu perfil.
          </p>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">8.3 Derecho de Cancelación (Supresión)</h3>
          <p>
            Puedes solicitar la eliminación de tus datos cuando: (a) ya no sean necesarios, (b) retires tu consentimiento, (c) te opongas al tratamiento, o (d) se hayan tratado ilícitamente. Algunas excepciones aplican por obligaciones legales.
          </p>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">8.4 Derecho de Oposición</h3>
          <p>
            Puedes oponerte al tratamiento de tus datos basado en interés legítimo, incluyendo perfilamiento y decisiones automatizadas.
          </p>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">8.5 Derecho de Portabilidad</h3>
          <p>
            Puedes recibir tus datos en formato estructurado, de uso común y lectura mecánica (CSV/JSON), y transmitirlos a otro responsable.
          </p>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">8.6 Cómo Ejercer tus Derechos</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Email: privacidad@vitria.cl</li>
            <li>Formulario de contacto en la plataforma</li>
            <li>Debes identificarte para verificar tu identidad</li>
            <li>Plazo de respuesta: 30 días hábiles (prorrogable 30 días más si es necesario)</li>
            <li>La respuesta será gratuita</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">9. Retención de Datos</h2>
          <p>Conservamos tus datos personales según los siguientes criterios:</p>
          
          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">9.1 Períodos de Retención</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Datos de cuenta activa:</strong> Mientras tu cuenta esté activa o sea necesario para proporcionar servicios</li>
            <li><strong>Datos de cuenta eliminada:</strong> 30 días en archivo de respaldo, luego eliminación permanente</li>
            <li><strong>Solicitudes de cotización:</strong> 2 años desde la última interacción (para análisis y métricas)</li>
            <li><strong>Reseñas publicadas:</strong> Indefinidamente mientras la agencia esté activa (información pública de interés general)</li>
            <li><strong>Datos de facturación/pago:</strong> 6 años (requisito legal tributario chileno)</li>
            <li><strong>Logs de seguridad:</strong> 12 meses</li>
            <li><strong>Cookies de sesión:</strong> Al cerrar navegador o logout</li>
          </ul>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">9.2 Eliminación de Cuenta</h3>
          <p>
            Al eliminar tu cuenta, procedemos a:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Eliminar o anonimizar tu información personal identificable</li>
            <li>Conservar datos agregados/anonimizados para estadísticas</li>
            <li>Mantener información requerida por ley (registros contables, fiscales)</li>
            <li>Las reseñas publicadas se mantienen pero se anonimizan (se muestra como "Usuario eliminado")</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">10. Cookies y Tecnologías Similares</h2>
          
          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">10.1 Cookies que Utilizamos</h3>
          <p>Utilizamos las siguientes tecnologías:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento (autenticación, sesión de usuario, preferencias básicas). No requieren consentimiento.</li>
            <li><strong>Cookies de funcionalidad:</strong> Mejoran experiencia (idioma, región). Basadas en tu consentimiento.</li>
            <li><strong>Local Storage:</strong> Para almacenar preferencias de interfaz localmente en tu dispositivo.</li>
          </ul>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">10.2 Lo que NO Hacemos</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>No utilizamos cookies de publicidad o marketing de terceros</li>
            <li>No implementamos seguimiento entre sitios (cross-site tracking)</li>
            <li>No vendemos datos de cookies a terceros</li>
            <li>No utilizamos herramientas de analytics de terceros que recopilen datos personales</li>
          </ul>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">10.3 Control de Cookies</h3>
          <p>
            Puedes controlar cookies desde tu navegador. Eliminar cookies esenciales puede afectar la funcionalidad de la plataforma (ejemplo: cerrar sesión automáticamente).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">11. Transferencias Internacionales</h2>
          
          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">11.1 Proveedores Internacionales</h3>
          <p>
            Utilizamos proveedores de servicios que pueden almacenar o procesar datos fuera de Chile:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Supabase (Estados Unidos):</strong> Almacenamiento de base de datos y archivos</li>
            <li><strong>Brevo (Francia/UE):</strong> Envío de correos electrónicos transaccionales</li>
          </ul>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">11.2 Salvaguardias Implementadas</h3>
          <p>Para transferencias internacionales, nos aseguramos de:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Utilizar proveedores con certificaciones de seguridad reconocidas (SOC 2, ISO 27001)</li>
            <li>Implementar cláusulas contractuales estándar de protección de datos</li>
            <li>Verificar que los proveedores cumplan con estándares equivalentes a la Ley 21.719</li>
            <li>Limitar la transferencia al mínimo necesario para el servicio</li>
            <li>Encriptar datos en tránsito y en reposo</li>
          </ul>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">11.3 Tu Consentimiento</h3>
          <p>
            Al aceptar esta política, consientes expresamente la transferencia internacional de tus datos bajo las salvaguardias descritas.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">12. Notificación de Brechas de Seguridad</h2>
          
          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">12.1 Nuestro Compromiso</h3>
          <p>
            En caso de una brecha de seguridad que comprometa tus datos personales, cumpliremos con las obligaciones de la Ley 21.719:
          </p>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">12.2 Notificación a Autoridades</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Notificaremos a la Agencia de Protección de Datos Personales (APDP) sin demora injustificada</li>
            <li>Proporcionaremos detalles del incidente, datos afectados y medidas correctivas</li>
          </ul>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">12.3 Notificación a Usuarios Afectados</h3>
          <p>
            Te notificaremos directamente cuando:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Exista un riesgo probable para tus derechos y libertades</li>
            <li>Datos sensibles hayan sido comprometidos</li>
            <li>Se requiera que tomes medidas protectoras (ejemplo: cambiar contraseña)</li>
          </ul>
          <p className="mt-2">
            La notificación incluirá: naturaleza de la brecha, datos afectados, consecuencias probables, medidas adoptadas y recomendaciones.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">13. Decisiones Automatizadas y Perfilamiento</h2>
          
          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">13.1 Uso Limitado</h3>
          <p>
            Vitria <strong>NO utiliza</strong> sistemas de toma de decisiones completamente automatizadas que produzcan efectos jurídicos o te afecten significativamente.
          </p>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">13.2 Procesamiento de Datos</h3>
          <p>
            Realizamos análisis básicos no automatizados para:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Mostrar agencias relevantes según búsqueda/filtros (decisión del usuario)</li>
            <li>Generar estadísticas agregadas de uso de la plataforma</li>
            <li>Calcular métricas de rendimiento para agencias (vistas, clics)</li>
          </ul>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">13.3 Tu Derecho</h3>
          <p>
            Tienes derecho a no ser objeto de decisiones basadas únicamente en tratamiento automatizado, incluida la elaboración de perfiles. Si implementáramos tales sistemas en el futuro, te informaríamos y permitiríamos solicitar intervención humana.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">14. Reclamaciones y Resolución de Conflictos</h2>
          
          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">14.1 Contacto Directo</h3>
          <p>
            Si tienes una queja sobre cómo tratamos tus datos personales, primero contáctanos:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Email: privacidad@vitria.cl</li>
            <li>Formulario de contacto en la plataforma</li>
            <li>Responderemos en máximo 30 días hábiles</li>
          </ul>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">14.2 Autoridad de Control</h3>
          <p>
            Si no estás satisfecho con nuestra respuesta, tienes derecho a presentar una reclamación ante:
          </p>
          <p className="mt-2">
            <strong>Agencia de Protección de Datos Personales (APDP)</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Organismo autónomo fiscalizador de la Ley 21.719</li>
            <li>Operacional desde diciembre de 2026</li>
            <li>Podrá investigar, sancionar y resolver reclamaciones</li>
          </ul>

          <h3 className="text-xl font-semibold text-dark mt-6 mb-3">14.3 Resolución Amistosa</h3>
          <p>
            Nos comprometemos a resolver cualquier disputa de manera transparente y colaborativa, priorizando tus derechos y la protección de tus datos personales.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">15. Menores de Edad</h2>
          <p>
            Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos intencionalmente información personal de menores. Si descubrimos que hemos recopilado datos de un menor sin consentimiento parental, eliminaremos esa información inmediatamente.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">16. Cambios a esta Política</h2>
          <p>
            Podemos actualizar esta Política de Privacidad ocasionalmente para reflejar cambios en nuestras prácticas, legislación o servicios.
          </p>
          <p className="mt-4">
            <strong>Te notificaremos sobre cambios significativos mediante:</strong>
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Aviso destacado en la plataforma</li>
            <li>Correo electrónico a tu cuenta registrada</li>
            <li>Solicitud de nuevo consentimiento si es requerido por ley</li>
          </ul>
          <p className="mt-2">
            Cambios menores entrarán en vigor al publicarse. El uso continuado de la plataforma después de cambios constituye aceptación.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">17. Información de Contacto</h2>
          <p>
            Para cualquier consulta, ejercicio de derechos o reclamación relacionada con esta Política de Privacidad:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Email de Privacidad:</strong> privacidad@vitria.cl</li>
            <li><strong>Soporte General:</strong> Formulario de contacto en la plataforma</li>
            <li><strong>Plazo de respuesta:</strong> 30 días hábiles (extensible 30 días adicionales en casos complejos)</li>
          </ul>
          <p className="mt-4">
            Cuando nos contactes para ejercer tus derechos, incluye:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Identificación válida (para verificar identidad)</li>
            <li>Descripción clara del derecho que deseas ejercer</li>
            <li>Dirección de correo electrónico asociada a tu cuenta</li>
          </ul>
        </section>

        <div className="bg-lilac/10 p-6 rounded-lg mt-8">
          <p className="text-sm text-dark/70">
            Esta política cumple con la Ley N° 21.719 sobre Protección de Datos Personales de Chile. 
            La Agencia de Protección de Datos Personales (APDP) será el organismo fiscalizador una vez entre en vigencia plena en diciembre de 2026.
          </p>
        </div>
      </div>
    </div>
  );
}
