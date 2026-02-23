import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes (FAQ)',
  description: 'Respuestas a las preguntas más comunes sobre Vitria: cómo buscar agencias, solicitar cotizaciones, registrar tu agencia, planes Premium y más.',
  alternates: { canonical: '/faq' },
};

export default function FAQPage() {
  const faqs = [
    {
      category: "Para Clientes",
      questions: [
        {
          q: "¿Es gratis usar Vitria para buscar agencias?",
          a: "Sí, Vitria es 100% gratuito para clientes. Puedes buscar agencias, ver sus perfiles, leer reseñas y enviar solicitudes de cotización sin costo alguno."
        },
        {
          q: "¿Cómo solicito una cotización?",
          a: "En el perfil de cualquier agencia encontrarás el botón 'Solicitar Cotización Gratis'. Completa el formulario con detalles de tu proyecto y la agencia recibirá tu solicitud directamente. Te contactarán por email con su propuesta."
        },
        {
          q: "¿Puedo contactar directamente a una agencia?",
          a: "Las agencias con plan Premium pueden mostrar su información de contacto directo (email, WhatsApp, sitio web). Para agencias regulares, usa el sistema de cotizaciones que garantiza que tu solicitud sea recibida y registrada."
        },
        {
          q: "¿Las agencias me cobrarán por una cotización?",
          a: "No, las cotizaciones son gratuitas y sin compromiso. Las agencias te enviarán una propuesta personalizada sin costo. Solo pagas si decides contratar sus servicios."
        },
        {
          q: "¿Cómo sé si una agencia es confiable?",
          a: "Revisa las reseñas de otros clientes, su portafolio de trabajos, años de experiencia y especialidades. Las agencias verificadas tienen un badge especial."
        }
      ]
    },
    {
      category: "Para Agencias",
      questions: [
        {
          q: "¿Cómo registro mi agencia en Vitria?",
          a: "Crea una cuenta seleccionando 'Tipo: Agencia', completa tu perfil con información de tu agencia (nombre, descripción, servicios, portafolio) y envía tu solicitud. Nuestro equipo revisará y aprobará tu perfil en 1-2 días hábiles."
        },
        {
          q: "¿Cuánto cuesta listar mi agencia?",
          a: "Crear un perfil básico en Vitria es gratuito. Puedes listar tu agencia, recibir cotizaciones y gestionar reseñas sin costo. Ofrecemos planes Premium con beneficios adicionales."
        },
        {
          q: "¿Qué incluye el plan Premium?",
          a: "El plan Premium incluye: badge dorado Premium visible, posicionamiento destacado en búsquedas, y capacidad de mostrar tu información de contacto directo (email, WhatsApp, sitio web) en tu perfil."
        },
        {
          q: "¿Cómo funciona el sistema de cotizaciones?",
          a: "Cuando un cliente está interesado en tus servicios, envía una solicitud de cotización con detalles de su proyecto. Recibes un email con la información del cliente y puedes responder directamente con tu propuesta personalizada."
        },
        {
          q: "¿Puedo ver analíticas de mi perfil?",
          a: "Sí, en tu panel de agencia (/mi-agencia/analytics) puedes ver: visualizaciones de perfil, solicitudes de cotización recibidas, clics en contacto, y tasas de conversión. Estas métricas te ayudan a optimizar tu perfil."
        },
        {
          q: "¿Cómo mejoro la salud de mi perfil?",
          a: "En tu dashboard verás un widget de 'Salud del Perfil' que muestra tu puntuación y qué falta completar: logo, imagen de portada, descripción completa, especialidades, portafolio (mínimo 3 proyectos), redes sociales, tamaño de equipo y rango de precios."
        }
      ]
    },
    {
      category: "Reseñas y Calificaciones",
      questions: [
        {
          q: "¿Quién puede dejar reseñas?",
          a: "Solo clientes registrados que hayan trabajado con una agencia pueden dejar reseñas. Esto asegura que las opiniones sean basadas en experiencias reales."
        },
        {
          q: "¿Las reseñas son moderadas?",
          a: "Sí, todas las reseñas pasan por moderación antes de publicarse para verificar que cumplan nuestros estándares: deben ser honestas, basadas en experiencias reales y sin lenguaje ofensivo."
        },
        {
          q: "¿Puedo responder a una reseña?",
          a: "Sí, como agencia puedes responder a las reseñas en tu perfil. Esto te permite agradecer comentarios positivos o aclarar situaciones en reviews negativas."
        },
        {
          q: "¿Puedo eliminar una reseña negativa?",
          a: "Las reseñas no pueden ser eliminadas por las agencias, pero puedes reportarlas si violan nuestros términos (información falsa, lenguaje ofensivo). Nuestro equipo revisará y tomará acción si es necesario."
        }
      ]
    },
    {
      category: "Privacidad y Seguridad",
      questions: [
        {
          q: "¿Cómo protegen mi información personal?",
          a: "Implementamos medidas de seguridad como encriptación de contraseñas, conexiones HTTPS, y cumplimos con la Ley 21.719 de Protección de Datos Personales de Chile. Lee nuestra Política de Privacidad para más detalles."
        },
        {
          q: "¿Qué información se comparte con las agencias?",
          a: "Cuando envías una solicitud de cotización, la agencia recibe tu nombre, email y detalles del proyecto. Tu información no se comparte con nadie más ni se usa para marketing sin tu consentimiento."
        },
        {
          q: "¿Puedo eliminar mi cuenta?",
          a: "Sí, puedes eliminar tu cuenta en cualquier momento desde la configuración. Al hacerlo, tu información personal será eliminada o anonimizada, excepto la que debamos retener por requisitos legales."
        }
      ]
    },
    {
      category: "Problemas Técnicos",
      questions: [
        {
          q: "No recibí el email de confirmación",
          a: "Revisa tu carpeta de spam. Si no lo encuentras, intenta solicitar un nuevo email de verificación desde la página de inicio de sesión. Si el problema persiste, contacta a soporte."
        },
        {
          q: "Olvidé mi contraseña",
          a: "Usa la opción 'Olvidé mi contraseña' en la página de inicio de sesión. Recibirás un email con instrucciones para crear una nueva contraseña."
        },
        {
          q: "Mi perfil no aparece en las búsquedas",
          a: "Verifica que tu agencia esté aprobada (revisa tu email de confirmación). Si ya está aprobada, puede tomar hasta 24 horas aparecer en todas las búsquedas. También asegúrate de haber completado información básica como servicios y ubicación."
        }
      ]
    }
  ];

  // Build FAQ schema from all questions
  const allQuestions = faqs.flatMap(section => section.questions);
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": allQuestions.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a,
      },
    })),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <h1 className="text-4xl font-bold text-primary mb-4">Preguntas Frecuentes (FAQ)</h1>
      <p className="text-lg text-dark/70 mb-12">
        Encuentra respuestas rápidas a las preguntas más comunes sobre Vitria
      </p>

      <div className="space-y-12">
        {faqs.map((section, idx) => (
          <section key={idx}>
            <h2 className="text-2xl font-bold text-primary mb-6 pb-2 border-b-2 border-primary/20">
              {section.category}
            </h2>
            <div className="space-y-6">
              {section.questions.map((faq, qIdx) => (
                <div key={qIdx} className="bg-white p-6 rounded-lg border-2 border-gray-200 hover:border-primary/30 transition">
                  <h3 className="text-lg font-semibold text-dark mb-3">
                    {faq.q}
                  </h3>
                  <p className="text-dark/70 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 bg-lilac/10 p-8 rounded-xl text-center">
        <h3 className="text-xl font-bold text-dark mb-3">
          ¿No encontraste lo que buscabas?
        </h3>
        <p className="text-dark/70">
          Contáctanos a través de la plataforma y te ayudaremos con tu consulta.
        </p>
      </div>
    </div>
  );
}
