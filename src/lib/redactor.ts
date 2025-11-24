import { PIIMatch, RedactionOptions, RedactionResult, PIIType } from '@/types';
import { detectEmails } from './detectors/emailDetector';
import { detectPhones } from './detectors/phoneDetector';
import { detectNames } from './detectors/nameDetector';
import { detectAddresses } from './detectors/addressDetector';

function removeOverlaps(matches: PIIMatch[]): PIIMatch[] {
  const result: PIIMatch[] = [];
  
  for (const match of matches) {
    const overlaps = result.some(
      existing => 
        (match.start >= existing.start && match.start < existing.end) ||
        (match.end > existing.start && match.end <= existing.end)
    );
    
    if (!overlaps) {
      result.push(match);
    }
  }
  
  return result;
}

export function redactText(text: string, options: RedactionOptions): RedactionResult {
  let allMatches: PIIMatch[] = [];
  
  if (options.enabledTypes.has(PIIType.EMAIL)) {
    allMatches = [...allMatches, ...detectEmails(text)];
  }
  
  if (options.enabledTypes.has(PIIType.PHONE)) {
    allMatches = [...allMatches, ...detectPhones(text)];
  }
  
  if (options.enabledTypes.has(PIIType.NAME)) {
    allMatches = [...allMatches, ...detectNames(text)];
  }
  
  if (options.enabledTypes.has(PIIType.ADDRESS)) {
    allMatches = [...allMatches, ...detectAddresses(text)];
  }
  
  allMatches.sort((a, b) => a.start - b.start);
  const uniqueMatches = removeOverlaps(allMatches);
  
  let redactedText = text;
  let offset = 0;
  
  uniqueMatches.forEach((match, index) => {
    const replacement = options.redactionStyle === 'blackout'
      ? '#'.repeat(match.value.length)
      : `[${match.type}_${index + 1}]`;
    
    const adjustedStart = match.start + offset;
    const adjustedEnd = match.end + offset;
    
    redactedText = 
      redactedText.slice(0, adjustedStart) + 
      replacement + 
      redactedText.slice(adjustedEnd);
    
    offset += replacement.length - (match.end - match.start);
  });
  
  const summary = uniqueMatches.reduce((acc, match) => {
    acc[match.type] = (acc[match.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    originalText: text,
    redactedText,
    matches: uniqueMatches,
    summary
  };
}