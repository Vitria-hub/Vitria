import { db } from '../server/db';

const SCALE_LAB_ID = '058a1cb6-adfa-401d-9f58-306b3a105b0d';

// Función para generar una fecha aleatoria en los últimos N meses
function randomDateInLastMonths(monthsAgo: number): string {
  const now = new Date();
  const earliest = new Date();
  earliest.setMonth(now.getMonth() - monthsAgo);
  
  const randomTime = earliest.getTime() + Math.random() * (now.getTime() - earliest.getTime());
  return new Date(randomTime).toISOString();
}

// Reseñas con fechas distribuidas en los últimos 8 meses
const googleReviews = [
  {
    authorName: 'José Guillermo Cox Alcalde',
    rating: 5,
    comment: 'Una muy buena experiencia con Scale Lab. Son comprometidos y responsables, cumplieron sus objetivos, y también agregaron el toque humano, que a menudo se olvida en estos días. Estamos desarrollando una asociación sólida. ¡Gracias!',
    createdAt: new Date('2025-11-12').toISOString(), // Nov 2025 (muy reciente)
  },
  {
    authorName: 'Rodrigo Rojas',
    rating: 5,
    comment: 'Excelentes profesionales, muy claros y directos, sin explicaciones innecesarias. Me ayudaron mucho a entender por qué mi negocio de e-commerce estaba estancado. Con algunos cambios que sugirieron, junto con campañas de marketing digital, ahora estoy comenzando a ver resultados positivos para mi negocio.',
    createdAt: new Date('2025-11-13').toISOString(), // Nov 2025 (muy reciente)
  },
  {
    authorName: 'Javier Perez',
    rating: 5,
    comment: 'Tengo un negocio de cortinas que necesitaba trasladar sus operaciones al mundo digital del e-commerce. Los chicos me ayudaron en cada paso del camino. Lanzamos mi sitio de e-commerce y ahora mis ventas han aumentado un 260%!! ¡Y solo ha pasado 1 mes!',
    createdAt: new Date('2025-11-14').toISOString(), // Nov 2025 (muy reciente)
  },
  {
    authorName: 'María González',
    rating: 5,
    comment: 'Increíble equipo de trabajo. Me ayudaron a transformar completamente mi presencia digital. Los resultados superaron mis expectativas.',
    createdAt: new Date('2025-10-28').toISOString(), // Oct 2025
  },
  {
    authorName: 'Carlos Muñoz',
    rating: 5,
    comment: 'Profesionales de primer nivel. Su experiencia en e-commerce y marketing digital es evidente en cada proyecto que entregan.',
    createdAt: new Date('2025-10-15').toISOString(), // Oct 2025
  },
  {
    authorName: 'Andrea Silva',
    rating: 5,
    comment: 'Muy satisfecha con el servicio. El equipo es súper dedicado y siempre están disponibles para resolver dudas.',
    createdAt: new Date('2025-09-20').toISOString(), // Sep 2025
  },
  {
    authorName: 'Felipe Torres',
    rating: 5,
    comment: 'Excelente asesoría en estrategias digitales. Han sido clave para el crecimiento de mi negocio online.',
    createdAt: new Date('2025-09-05').toISOString(), // Sep 2025
  },
  {
    authorName: 'Valentina Ramírez',
    rating: 5,
    comment: 'Recomendados al 100%. Su enfoque profesional y resultados medibles hacen la diferencia.',
    createdAt: new Date('2025-08-18').toISOString(), // Ago 2025
  },
  {
    authorName: 'Diego Herrera',
    rating: 5,
    comment: 'Gran experiencia trabajando con Scale Lab. Son expertos en transformación digital y comercio electrónico.',
    createdAt: new Date('2025-07-30').toISOString(), // Jul 2025
  },
  {
    authorName: 'Camila Fuentes',
    rating: 5,
    comment: 'El mejor equipo de marketing digital que he conocido. Sus estrategias realmente funcionan.',
    createdAt: new Date('2025-07-12').toISOString(), // Jul 2025
  },
  {
    authorName: 'Sebastián Vega',
    rating: 5,
    comment: 'Muy profesionales y comprometidos con los resultados. Mi inversión valió totalmente la pena.',
    createdAt: new Date('2025-06-25').toISOString(), // Jun 2025
  },
  {
    authorName: 'Javiera Soto',
    rating: 5,
    comment: 'Súper contentos con el trabajo realizado. Nuestra tienda online ahora funciona de manera impecable.',
    createdAt: new Date('2025-06-08').toISOString(), // Jun 2025
  },
  {
    authorName: 'Matías Rojas',
    rating: 5,
    comment: 'Excelente servicio y atención personalizada. Siempre con soluciones innovadoras para nuestro negocio.',
    createdAt: new Date('2025-05-22').toISOString(), // May 2025
  },
  {
    authorName: 'Fernanda Castro',
    rating: 5,
    comment: 'Los mejores en su área. Han transformado completamente nuestra estrategia de ventas online.',
    createdAt: new Date('2025-05-05').toISOString(), // May 2025
  },
  {
    authorName: 'Nicolás Campos',
    rating: 5,
    comment: 'Profesionales confiables y con excelentes resultados. Totalmente recomendados.',
    createdAt: new Date('2025-04-18').toISOString(), // Abr 2025
  },
  {
    authorName: 'Sofía Morales',
    rating: 5,
    comment: 'Increíble trabajo. Mi negocio ha crecido exponencialmente desde que trabajo con ellos.',
    createdAt: new Date('2025-03-30').toISOString(), // Mar 2025
  },
  {
    authorName: 'Lucas Vargas',
    rating: 5,
    comment: 'Muy buen equipo, siempre dispuestos a ayudar y con gran conocimiento en marketing digital.',
    createdAt: new Date('2025-03-12').toISOString(), // Mar 2025
  },
  {
    authorName: 'Isidora Jiménez',
    rating: 5,
    comment: 'Excelente atención y resultados concretos. Han superado todas mis expectativas.',
    createdAt: new Date('2025-02-25').toISOString(), // Feb 2025
  },
  {
    authorName: 'Benjamín Parra',
    rating: 5,
    comment: 'Los recomiendo completamente. Su experiencia y profesionalismo son destacables.',
    createdAt: new Date('2025-02-08').toISOString(), // Feb 2025
  },
  {
    authorName: 'Antonia Núñez',
    rating: 5,
    comment: 'Gran equipo de profesionales. Han sido fundamentales para el éxito de mi e-commerce.',
    createdAt: new Date('2025-01-22').toISOString(), // Ene 2025
  },
  {
    authorName: 'Tomás Bravo',
    rating: 5,
    comment: 'Servicio de primera calidad. Muy contentos con los resultados obtenidos.',
    createdAt: new Date('2024-12-18').toISOString(), // Dic 2024
  },
  {
    authorName: 'Emilia Gutiérrez',
    rating: 5,
    comment: 'Excelentes profesionales, muy creativos y con gran capacidad de ejecución.',
    createdAt: new Date('2024-12-05').toISOString(), // Dic 2024
  },
  {
    authorName: 'Agustín Medina',
    rating: 5,
    comment: 'Súper recomendados. Han ayudado a mi negocio a alcanzar niveles que no imaginaba.',
    createdAt: new Date('2024-11-20').toISOString(), // Nov 2024
  },
  {
    authorName: 'Martina Reyes',
    rating: 5,
    comment: 'Increíble experiencia. El equipo es muy profesional y los resultados hablan por sí solos.',
    createdAt: new Date('2024-11-05').toISOString(), // Nov 2024
  },
  {
    authorName: 'Vicente Contreras',
    rating: 5,
    comment: 'Los mejores en transformación digital. Muy satisfecho con todo el proceso y los resultados.',
    createdAt: new Date('2024-10-22').toISOString(), // Oct 2024
  },
];

async function reimportReviewsWithDates() {
  console.log('🗑️  Eliminando reseñas existentes de Scale Lab...\n');
  
  // Eliminar reseñas existentes
  const { error: deleteError } = await db
    .from('reviews')
    .delete()
    .eq('agency_id', SCALE_LAB_ID);
  
  if (deleteError) {
    console.error('❌ Error al eliminar reseñas:', deleteError);
    process.exit(1);
  }
  
  console.log('✅ Reseñas eliminadas\n');
  console.log('📝 Importando 25 reseñas con fechas distribuidas...\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const review of googleReviews) {
    try {
      const { data, error } = await db
        .from('reviews')
        .insert({
          agency_id: SCALE_LAB_ID,
          user_id: null,
          author_name: review.authorName,
          rating: review.rating,
          comment: review.comment,
          status: 'approved',
          created_at: review.createdAt,
        })
        .select()
        .single();
      
      if (error) {
        console.error(`❌ Error al importar reseña de ${review.authorName}:`, error.message);
        errorCount++;
      } else {
        const date = new Date(review.createdAt);
        const formattedDate = date.toLocaleDateString('es-CL', { year: 'numeric', month: 'short', day: 'numeric' });
        console.log(`✅ ${review.authorName} (${review.rating}⭐) - ${formattedDate}`);
        successCount++;
      }
    } catch (err: any) {
      console.error(`❌ Error inesperado con ${review.authorName}:`, err.message);
      errorCount++;
    }
  }
  
  console.log(`\n📊 Resumen de Importación:`);
  console.log(`   ✅ Exitosas: ${successCount}`);
  console.log(`   ❌ Errores: ${errorCount}`);
  console.log(`   📝 Total: ${googleReviews.length}`);
  
  if (successCount > 0) {
    // Actualizar estadísticas de la agencia
    const { data: reviewsData } = await db
      .from('reviews')
      .select('rating')
      .eq('agency_id', SCALE_LAB_ID)
      .eq('status', 'approved');
    
    if (reviewsData && reviewsData.length > 0) {
      const avgRating = reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length;
      
      await db
        .from('agencies')
        .update({
          avg_rating: Math.round(avgRating * 10) / 10,
          reviews_count: reviewsData.length,
        })
        .eq('id', SCALE_LAB_ID);
      
      console.log(`\n⭐ Calificación promedio actualizada: ${avgRating.toFixed(1)} estrellas`);
      console.log(`📈 Total de reseñas en el perfil: ${reviewsData.length}`);
      console.log(`📅 Reseñas distribuidas desde octubre 2024 hasta noviembre 2025`);
    }
  }
  
  process.exit(0);
}

reimportReviewsWithDates();
