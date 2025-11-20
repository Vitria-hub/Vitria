export const CATEGORY_LEGACY_MAPPING: Record<string, string[]> = {
  'publicidad-digital': ['publicidad-digital', 'social-media', 'estrategia-consultoria', 'publicidad'],
  'branding-identidad': ['branding-identidad', 'diseno-grafico'],
  'desarrollo-web': ['desarrollo-web'],
  'produccion-contenido': ['contenido-redes', 'video-fotografia', 'produccion-contenido'],
  'relaciones-publicas': ['relaciones-publicas'],
};

export function expandCategoryToLegacyIds(categoryId: string): string[] {
  return CATEGORY_LEGACY_MAPPING[categoryId] || [categoryId];
}

export function sumCategoryCounts(categoryCounts: Record<string, number>, legacyIds: string[]): number {
  return legacyIds.reduce((sum, id) => sum + (categoryCounts[id] || 0), 0);
}
