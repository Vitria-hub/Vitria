import { db } from '../server/db';

async function checkReviewsTable() {
  console.log('🔍 Verificando estructura de la tabla reviews...\n');
  
  // Intentar obtener una reseña de ejemplo para ver la estructura
  const { data, error } = await db
    .from('reviews')
    .select('*')
    .limit(1);
  
  if (error) {
    console.error('❌ Error:', error);
  } else if (data && data.length > 0) {
    console.log('📊 Columnas disponibles:', Object.keys(data[0]));
  } else {
    console.log('ℹ️  No hay reseñas en la tabla');
    
    // Intentar crear una reseña de prueba para ver qué columnas acepta
    const { error: insertError } = await db
      .from('reviews')
      .insert({
        agency_id: '058a1cb6-adfa-401d-9f58-306b3a105b0d',
        rating: 5,
        comment: 'Test',
      });
    
    if (insertError) {
      console.log('❌ Error al insertar:', insertError);
    }
  }
  
  process.exit(0);
}

checkReviewsTable();
