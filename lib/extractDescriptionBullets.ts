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
    .filter(s => s.length > 0);

  const shortSentences = sentences.filter(s => s.length < 150);
  
  if (shortSentences.length > 0) {
    return shortSentences.slice(0, 6);
  }

  const truncatedSentences = sentences
    .slice(0, 3)
    .map(s => s.length > 120 ? s.substring(0, 117) + '...' : s);

  return truncatedSentences;
}
