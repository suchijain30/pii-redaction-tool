import { PIIMatch, PIIType } from '@/types';

export function detectAddresses(text: string): PIIMatch[] {
  const addressRegex = /\b\d+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Way|Place|Pl)\b/gi;
  const matches: PIIMatch[] = [];
  
  let match;
  while ((match = addressRegex.exec(text)) !== null) {
    matches.push({
      type: PIIType.ADDRESS,
      value: match[0],
      start: match.index,
      end: match.index + match[0].length,
      confidence: 0.8
    });
  }
  
  return matches;
}