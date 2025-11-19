export const MAIN_CATEGORIES = [
  {
    id: 'publicidad-digital',
    label: 'Publicidad Digital',
    description: 'Anuncios pagados en plataformas digitales',
    services: [
      'Meta Ads (Facebook/Instagram)',
      'Google Ads (Search/Display/YouTube)',
      'TikTok Ads',
      'LinkedIn Ads',
      'Publicidad Programática',
      'Twitter Ads',
      'Amazon Ads'
    ]
  },
  {
    id: 'branding-identidad',
    label: 'Branding e Identidad',
    description: 'Construcción y diseño de marca',
    services: [
      'Diseño de Logo',
      'Identidad Corporativa',
      'Naming y Estrategia de Marca',
      'Brandbook y Manual de Marca',
      'Rebranding',
      'Packaging',
      'Diseño Editorial'
    ]
  },
  {
    id: 'desarrollo-web',
    label: 'Desarrollo Web',
    description: 'Sitios web, plataformas y aplicaciones',
    services: [
      'Sitio Web Corporativo',
      'Landing Pages',
      'E-commerce (Shopify/WooCommerce)',
      'Desarrollo de Apps Móviles',
      'Plataformas SaaS',
      'Desarrollo WordPress',
      'Desarrollo a Medida'
    ]
  },
  {
    id: 'contenido-redes',
    label: 'Contenido y Redes',
    description: 'Gestión de contenido y redes sociales',
    services: [
      'Community Management',
      'Gestión de Redes Sociales',
      'Creación de Contenido',
      'Copywriting',
      'Content Marketing',
      'Marketing de Influencers',
      'Blogs y Artículos'
    ]
  },
  {
    id: 'video-fotografia',
    label: 'Video y Fotografía',
    description: 'Producción audiovisual y fotografía',
    services: [
      'Producción Audiovisual',
      'Video Corporativo',
      'Fotografía Profesional',
      'Fotografía de Producto',
      'Animación y Motion Graphics',
      'Edición de Video',
      'Fotografía Publicitaria'
    ]
  },
  {
    id: 'estrategia-consultoria',
    label: 'Estrategia y Consultoría',
    description: 'Planificación estratégica y análisis',
    services: [
      'Consultoría de Marketing Digital',
      'Estrategia Digital',
      'Performance Marketing',
      'Growth Marketing',
      'Analytics y Reporting',
      'Marketing Automation',
      'CRO (Optimización de Conversión)'
    ]
  },
  {
    id: 'relaciones-publicas',
    label: 'Relaciones Públicas',
    description: 'Comunicación corporativa y eventos',
    services: [
      'Relaciones Públicas (RRPP)',
      'Comunicación Corporativa',
      'Gestión de Crisis',
      'Organización de Eventos',
      'Prensa y Medios',
      'Vocería y Media Training'
    ]
  },
  {
    id: 'diseno-grafico',
    label: 'Diseño Gráfico',
    description: 'Diseño visual y material gráfico',
    services: [
      'Diseño Gráfico General',
      'Material POP',
      'Diseño de Presentaciones',
      'Infografías',
      'Diseño para Redes Sociales',
      'Ilustración',
      'Diseño de Merchandising'
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
