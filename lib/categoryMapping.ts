export const CATEGORY_LEGACY_MAPPING: Record<string, string[]> = {
  'performance-ads': ['publicidad-digital', 'estrategia-consultoria', 'publicidad'],
  'social-media': ['social-media', 'contenido-redes'],
  'branding-identidad': ['branding-identidad', 'diseno-grafico'],
  'desarrollo-web': ['desarrollo-web'],
  'produccion-contenido': ['video-fotografia', 'produccion-contenido'],
  'relaciones-publicas': ['relaciones-publicas'],
};

export function expandCategoryToLegacyIds(categoryId: string): string[] {
  const legacyIds = CATEGORY_LEGACY_MAPPING[categoryId] || [];
  return [categoryId, ...legacyIds];
}

export function sumCategoryCounts(categoryCounts: Record<string, number>, legacyIds: string[]): number {
  return legacyIds.reduce((sum, id) => sum + (categoryCounts[id] || 0), 0);
}
