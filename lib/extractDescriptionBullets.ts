export function extractDescriptionBullets(description: string | null): string[] {
  if (!description) {
    return [];
  }

  const lines = description.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  const bulletLines = lines.filter(line => {
    return line.startsWith('•') || line.startsWith('*') || line.startsWith('-') || line.startsWith('·');
  });

  if (bulletLines.length > 0) {
    return bulletLines
      .map(line => line.replace(/^[•*\-·]\s*/, '').trim())
      .filter(line => line.length > 0)
      .slice(0, 6);
  }

  const sentences = description
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && s.length < 150);

  return sentences.slice(0, 6);
}
