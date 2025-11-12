export interface SpecialtyCategory {
  id: string;
  label: string;
  specialties: string[];
}

export const SPECIALTY_CATEGORIES: SpecialtyCategory[] = [
  {
    id: 'advertising',
    label: 'Plataformas de Publicidad',
    specialties: [
      'Google Ads',
      'Meta Ads',
      'TikTok Ads',
      'LinkedIn Ads',
      'YouTube Ads',
      'Twitter Ads',
      'Display Advertising',
      'Programmatic Advertising'
    ],
  },
  {
    id: 'ecommerce',
    label: 'E-commerce & CMS',
    specialties: [
      'Shopify',
      'WooCommerce',
      'PrestaShop',
      'WordPress',
      'Webflow',
      'Magento',
      'Mercado Libre',
      'Amazon'
    ],
  },
  {
    id: 'automation',
    label: 'Marketing Automation',
    specialties: [
      'HubSpot',
      'Salesforce',
      'Mailchimp',
      'ActiveCampaign',
      'Klaviyo',
      'Zapier',
      'Make (Integromat)'
    ],
  },
  {
    id: 'social',
    label: 'Redes Sociales',
    specialties: [
      'Instagram',
      'TikTok',
      'LinkedIn',
      'Facebook',
      'YouTube',
      'Twitter',
      'Pinterest',
      'Community Management'
    ],
  },
  {
    id: 'design',
    label: 'Diseño & Creatividad',
    specialties: [
      'Adobe Creative Suite',
      'Figma',
      'Sketch',
      'Canva',
      'Video Producción',
      'Motion Graphics',
      'Ilustración',
      'Fotografía Profesional'
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics & Data',
    specialties: [
      'Google Analytics',
      'Google Tag Manager',
      'Data Studio',
      'Power BI',
      'Tableau',
      'SEO',
      'SEM',
      'A/B Testing'
    ],
  },
  {
    id: 'development',
    label: 'Desarrollo & Tecnología',
    specialties: [
      'React',
      'Next.js',
      'Laravel',
      'Django',
      'Node.js',
      'Python',
      'API Development',
      'Mobile Apps'
    ],
  },
];

export const ALL_SPECIALTIES = SPECIALTY_CATEGORIES.flatMap(cat => cat.specialties);
