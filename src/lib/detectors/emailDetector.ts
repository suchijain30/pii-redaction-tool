import { PIIMatch, PIIType } from '@/types';

export function detectEmails(text: string): PIIMatch[] {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const matches: PIIMatch[] = [];
  
  let match;
  while ((match = emailRegex.exec(text)) !== null) {
    matches.push({
      type: PIIType.EMAIL,
      value: match[0],
      start: match.index,
      end: match.index + match[0].length,
      confidence: 1.0
    });
  }
  
  return matches;
}