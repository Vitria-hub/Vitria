export function generateAgencySummary(
  description: string | null,
  services: string[]
): string {
  if (!description && services.length === 0) {
    return 'Agencia de marketing digital y comunicación.';
  }

  const mainServices = services.slice(0, 3);
  
  if (!description) {
    if (mainServices.length === 1) {
      return `Agencia especializada en ${mainServices[0]}.`;
    } else if (mainServices.length === 2) {
      return `Agencia experta en ${mainServices[0]} y ${mainServices[1]}.`;
    } else {
      return `Agencia especializada en ${mainServices[0]}, ${mainServices[1]} y ${mainServices[2]}.`;
    }
  }

  const descWords = description.split(' ');
  if (descWords.length <= 25) {
    return description;
  }

  const shortDesc = descWords.slice(0, 15).join(' ');
  
  if (mainServices.length > 0) {
    const serviceText = mainServices.length === 1 
      ? mainServices[0]
      : mainServices.length === 2
        ? `${mainServices[0]} y ${mainServices[1]}`
        : `${mainServices[0]}, ${mainServices[1]} y ${mainServices[2]}`;
    
    return `${shortDesc}... Especialistas en ${serviceText}.`;
  }

  return `${shortDesc}...`;
}
