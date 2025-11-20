export interface ProfileHealthCheck {
  field: string;
  label: string;
  completed: boolean;
  weight: number;
}

export interface ProfileHealthResult {
  score: number;
  checks: ProfileHealthCheck[];
  missingCount: number;
  totalChecks: number;
}

export function calculateProfileHealth(agency: any): ProfileHealthResult {
  const checks: ProfileHealthCheck[] = [
    {
      field: 'logo_url',
      label: 'Logo agregado',
      completed: !!agency.logo_url,
      weight: 20
    },
    {
      field: 'description',
      label: 'Descripción completa (min 200 caracteres)',
      completed: agency.description && agency.description.length >= 200,
      weight: 25
    },
    {
      field: 'services',
      label: 'Servicios definidos',
      completed: agency.services && agency.services.length > 0,
      weight: 10
    },
    {
      field: 'specialties',
      label: 'Especialidades técnicas agregadas',
      completed: agency.specialties && agency.specialties.length > 0,
      weight: 10
    },
    {
      field: 'price_range',
      label: 'Rango de precios definido',
      completed: !!agency.price_range,
      weight: 5
    },
    {
      field: 'employees',
      label: 'Tamaño de equipo definido',
      completed: agency.employees_min != null && agency.employees_max != null,
      weight: 5
    },
    {
      field: 'social_media',
      label: 'Al menos 2 redes sociales conectadas',
      completed: [
        agency.facebook_url,
        agency.instagram_url,
        agency.linkedin_url,
        agency.twitter_url,
        agency.youtube_url,
        agency.tiktok_url
      ].filter(Boolean).length >= 2,
      weight: 10
    },
    {
      field: 'portfolio',
      label: 'Casos de estudio en portafolio (min 3)',
      completed: agency.portfolio_count >= 3,
      weight: 15
    }
  ];

  const completedChecks = checks.filter(c => c.completed);
  const score = completedChecks.reduce((sum, check) => sum + check.weight, 0);
  const missingCount = checks.length - completedChecks.length;

  return {
    score,
    checks,
    missingCount,
    totalChecks: checks.length
  };
}

export function getHealthColor(score: number): string {
  if (score >= 80) return 'green';
  if (score >= 50) return 'yellow';
  return 'red';
}

export function getHealthEmoji(score: number): string {
  if (score >= 80) return '🟢';
  if (score >= 50) return '🟡';
  return '🔴';
}

export function getHealthLabel(score: number): string {
  if (score >= 80) return 'Excelente';
  if (score >= 50) return 'Mejorable';
  return 'Incompleto';
}
