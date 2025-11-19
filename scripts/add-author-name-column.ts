import { db } from '../server/db';

async function addAuthorNameColumn() {
  console.log('📝 Agregando columna author_name a la tabla reviews...\n');
  
  // Primero verificar si la columna ya existe intentando insertar un dato con author_name
  try {
    const { data, error } = await db
      .from('reviews')
      .insert({
        agency_id: '058a1cb6-adfa-401d-9f58-306b3a105b0d',
        rating: 5,
        comment: 'Test de importación de reseñas de Google Maps',
        author_name: 'Test User',
        status: 'pending',
      })
      .select()
      .single();
    
    if (error) {
      console.error('❌ Error (esto es esperado si la columna no existe):', error.message);
      console.log('\nℹ️  Necesitas agregar la columna author_name manualmente en Supabase.');
      console.log('   Ve a tu proyecto de Supabase → Table Editor → reviews');
      console.log('   Agrega una nueva columna:');
      console.log('   - Nombre: author_name');
      console.log('   - Tipo: text');
      console.log('   - Nullable: true');
    } else {
      console.log('✅ La columna author_name ya existe!');
      console.log('   Eliminando reseña de prueba...');
      
      await db
        .from('reviews')
        .delete()
        .eq('id', data.id);
      
      console.log('   ✅ Listo');
    }
  } catch (err) {
    console.error('❌ Error inesperado:', err);
  }
  
  process.exit(0);
}

addAuthorNameColumn();
