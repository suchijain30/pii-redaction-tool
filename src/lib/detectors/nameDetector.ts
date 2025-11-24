import { PIIMatch, PIIType } from '@/types';

export function detectNames(text: string): PIIMatch[] {
  const nameRegex = /\b[A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\b/g;
  const matches: PIIMatch[] = [];
  
  const commonWords = new Set([
    'The', 'And', 'For', 'But', 'Not', 'With', 'From', 'This', 'That',
    'Have', 'Has', 'Had', 'Was', 'Were', 'Been', 'Being', 'Are', 'Can',
    'Could', 'Should', 'Would', 'May', 'Might', 'Must', 'Will', 'Shall'
  ]);
  
  let match;
  while ((match = nameRegex.exec(text)) !== null) {
    const name = match[0];
    const firstName = name.split(' ')[0];
    
    if (!commonWords.has(firstName)) {
      matches.push({
        type: PIIType.NAME,
        value: name,
        start: match.index,
        end: match.index + name.length,
        confidence: 0.75
      });
    }
  }
  
  return matches;
}