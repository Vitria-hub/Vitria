import { db } from '../server/db';

async function deleteAllAgencies() {
  console.log('🗑️  Eliminando todas las agencias...');
  
  // Delete related data first
  await db.from('portfolio_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('✅ Portfolio items eliminados');
  
  await db.from('reviews').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('✅ Reviews eliminadas');
  
  await db.from('quote_requests').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('✅ Quote requests eliminadas');
  
  await db.from('agency_metrics_daily').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('✅ Métricas eliminadas');
  
  await db.from('sponsored_slots').delete().neq('slot_position', 999999);
  console.log('✅ Sponsored slots eliminados');
  
  // Delete agencies
  const { error } = await db.from('agencies').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  if (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
  
  console.log('✅ Todas las agencias eliminadas exitosamente');
  
  // Verify
  const { count } = await db.from('agencies').select('*', { count: 'exact', head: true });
  console.log(`📊 Total de agencias restantes: ${count}`);
  
  process.exit(0);
}

deleteAllAgencies().catch(console.error);
