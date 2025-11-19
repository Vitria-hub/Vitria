import { db } from '../server/db';

async function updatePriceRange() {
  console.log('📝 Actualizando rango de precios de Scale Lab...');
  
  const { data, error } = await db
    .from('agencies')
    .update({ price_range: '3-5M' })
    .eq('slug', 'scale-lab')
    .select();
  
  if (error) {
    console.error('❌ Error:', error);
  } else {
    console.log('✅ Actualizado correctamente:', data);
  }
  
  process.exit(0);
}

updatePriceRange();
