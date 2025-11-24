import { PIIMatch, PIIType } from '@/types';

export function detectPhones(text: string): PIIMatch[] {
  const phonePatterns = [
    /\b(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
    /\b\+\d{1,3}[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}\b/g
  ];
  
  const matches: PIIMatch[] = [];
  const seen = new Set<string>();
  
  for (const pattern of phonePatterns) {
    const regex = new RegExp(pattern.source, 'g');
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      const key = `${match.index}-${match[0]}`;
      if (!seen.has(key)) {
        seen.add(key);
        matches.push({
          type: PIIType.PHONE,
          value: match[0],
          start: match.index,
          end: match.index + match[0].length,
          confidence: 0.95
        });
      }
    }
  }
  
  return matches;
}