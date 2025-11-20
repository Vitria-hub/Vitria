export const MAIN_CATEGORIES = [
  {
    id: 'performance-ads',
    label: 'Performance & Ads',
    description: 'SEO, SEM, publicidad pagada y performance',
    services: [
      'SEO (Posicionamiento Orgánico)',
      'SEM (Google Ads, Bing Ads)',
      'Meta Ads (Facebook/Instagram)',
      'TikTok Ads',
      'LinkedIn Ads',
      'Twitter/X Ads',
      'YouTube Ads',
      'Publicidad Programática',
      'Email Marketing',
      'Marketing Automation',
      'Performance Marketing',
      'Growth Marketing',
      'Analytics y Reporting',
      'Optimización de Conversión (CRO)',
      'Retargeting y Remarketing'
    ]
  },
  {
    id: 'social-media',
    label: 'Social Media',
    description: 'Gestión de redes sociales y community management',
    services: [
      'Community Management',
      'Gestión de Redes Sociales',
      'Marketing de Influencers',
      'Estrategia de Contenido Social',
      'Creación de Contenido para RRSS',
      'Social Listening',
      'Análisis de Redes Sociales',
      'Campañas Virales',
      'TikTok Marketing',
      'Instagram Marketing',
      'Facebook Marketing',
      'LinkedIn Marketing',
      'Twitter/X Marketing',
      'Pinterest Marketing'
    ]
  },
  {
    id: 'branding-identidad',
    label: 'Diseño y Branding',
    description: 'Identidad visual y diseño de marca',
    services: [
      'Diseño de Logo',
      'Identidad Corporativa',
      'Naming y Estrategia de Marca',
      'Brandbook y Manual de Marca',
      'Rebranding',
      'Packaging',
      'Diseño Editorial',
      'Diseño Gráfico',
      'Material POP',
      'Diseño de Presentaciones',
      'Infografías',
      'Diseño para Redes Sociales',
      'Ilustración'
    ]
  },
  {
    id: 'desarrollo-web',
    label: 'Desarrollo Web',
    description: 'Sitios web, e-commerce y aplicaciones',
    services: [
      'Sitio Web Corporativo',
      'Landing Pages',
      'E-commerce (Shopify/WooCommerce)',
      'Desarrollo de Apps Móviles',
      'Plataformas SaaS',
      'Desarrollo WordPress',
      'Desarrollo a Medida',
      'UX/UI Design',
      'Mantenimiento Web'
    ]
  },
  {
    id: 'produccion-contenido',
    label: 'Producción de Contenido',
    description: 'Audiovisual, copywriting y contenido',
    services: [
      'Producción Audiovisual',
      'Video Corporativo',
      'Fotografía Profesional',
      'Fotografía de Producto',
      'Animación y Motion Graphics',
      'Edición de Video',
      'Fotografía Publicitaria',
      'Copywriting',
      'Content Marketing',
      'Creación de Contenido',
      'Blogs y Artículos',
      'Guiones y Storytelling'
    ]
  },
  {
    id: 'relaciones-publicas',
    label: 'Relaciones Públicas',
    description: 'RRPP, comunicación y eventos',
    services: [
      'Relaciones Públicas (RRPP)',
      'Comunicación Corporativa',
      'Gestión de Crisis',
      'Organización de Eventos',
      'Prensa y Medios',
      'Vocería y Media Training',
      'Comunicación Interna'
    ]
  }
] as const;

export const REGIONS = [
  { value: 'arica-parinacota', label: 'Arica y Parinacota' },
  { value: 'tarapaca', label: 'Tarapacá' },
  { value: 'antofagasta', label: 'Antofagasta' },
  { value: 'atacama', label: 'Atacama' },
  { value: 'coquimbo', label: 'Coquimbo' },
  { value: 'valparaiso', label: 'Valparaíso' },
  { value: 'metropolitana', label: 'Metropolitana de Santiago' },
  { value: 'ohiggins', label: "O'Higgins" },
  { value: 'maule', label: 'Maule' },
  { value: 'nuble', label: 'Ñuble' },
  { value: 'biobio', label: 'Biobío' },
  { value: 'araucania', label: 'La Araucanía' },
  { value: 'los-rios', label: 'Los Ríos' },
  { value: 'los-lagos', label: 'Los Lagos' },
  { value: 'aysen', label: 'Aysén' },
  { value: 'magallanes', label: 'Magallanes y la Antártica Chilena' },
] as const;

export type CategoryId = typeof MAIN_CATEGORIES[number]['id'];

export function getCategoryLabel(categoryId: string): string {
  const category = MAIN_CATEGORIES.find(c => c.id === categoryId);
  return category?.label || categoryId;
}

export function getCategoryServices(categoryId: string): readonly string[] {
  const category = MAIN_CATEGORIES.find(c => c.id === categoryId);
  return category?.services || [];
}
