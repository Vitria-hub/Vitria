import { db } from '../server/db';

const SCALE_LAB_ID = '058a1cb6-adfa-401d-9f58-306b3a105b0d';

const googleReviews = [
  {
    authorName: 'José Guillermo Cox Alcalde',
    rating: 5,
    comment: 'Una muy buena experiencia con Scale Lab. Son comprometidos y responsables, cumplieron sus objetivos, y también agregaron el toque humano, que a menudo se olvida en estos días. Estamos desarrollando una asociación sólida. ¡Gracias!',
  },
  {
    authorName: 'Rodrigo Rojas',
    rating: 5,
    comment: 'Excelentes profesionales, muy claros y directos, sin explicaciones innecesarias. Me ayudaron mucho a entender por qué mi negocio de e-commerce estaba estancado. Con algunos cambios que sugirieron, junto con campañas de marketing digital, ahora estoy comenzando a ver resultados positivos para mi negocio.',
  },
  {
    authorName: 'Javier Perez',
    rating: 5,
    comment: 'Tengo un negocio de cortinas que necesitaba trasladar sus operaciones al mundo digital del e-commerce. Los chicos me ayudaron en cada paso del camino. Lanzamos mi sitio de e-commerce y ahora mis ventas han aumentado un 260%!! ¡Y solo ha pasado 1 mes!',
  },
];

async function importGoogleReviews() {
  console.log('📝 Importando reseñas de Google Maps a Scale Lab...\n');
  
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
        })
        .select()
        .single();
      
      if (error) {
        console.error(`❌ Error al importar reseña de ${review.authorName}:`, error);
        errorCount++;
      } else {
        console.log(`✅ Importada: ${review.authorName} (${review.rating}⭐)`);
        successCount++;
      }
    } catch (err) {
      console.error(`❌ Error inesperado con ${review.authorName}:`, err);
      errorCount++;
    }
  }
  
  console.log(`\n📊 Resumen:`);
  console.log(`   ✅ Exitosas: ${successCount}`);
  console.log(`   ❌ Errores: ${errorCount}`);
  console.log(`   📝 Total: ${googleReviews.length}`);
  
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
    
    console.log(`\n⭐ Calificación promedio actualizada: ${avgRating.toFixed(1)} (${reviewsData.length} reseñas)`);
  }
  
  process.exit(0);
}

importGoogleReviews();
