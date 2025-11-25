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

    if (!overlaps) result.push(match);
  }
  
  return result;
}

export function redactText(text: string, options: RedactionOptions): RedactionResult {
  let allMatches: PIIMatch[] = [];

  // Collect matches based on enabled types
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

  // Sort by position + remove overlaps
  allMatches.sort((a, b) => a.start - b.start);
  const uniqueMatches = removeOverlaps(allMatches);

  // Per-type counters for readable labels
  const counters: Record<PIIType, number> = {
    [PIIType.EMAIL]: 0,
    [PIIType.PHONE]: 0,
    [PIIType.NAME]: 0,
    [PIIType.ADDRESS]: 0
  };

  // Mapping readable tokens
  const labelMap: Record<PIIType, string> = {
    [PIIType.EMAIL]: 'EMAIL',
    [PIIType.PHONE]: 'PHONE',
    [PIIType.NAME]: 'NAME',
    [PIIType.ADDRESS]: 'ADDRESS'
  };

  let redactedText = text;
  let offset = 0;

  // Apply redactions
  uniqueMatches.forEach(match => {
    counters[match.type] += 1;

    let replacement = "";

    if (options.redactionStyle === "blackout") {
      // PDF cannot encode █ — use hashes
      replacement = "#".repeat(match.value.length);
    } else {
      // Use descriptive replacement e.g., [NAME_2]
      const label = labelMap[match.type];
      replacement = `[${label}_${counters[match.type]}]`;
    }

    const adjustedStart = match.start + offset;
    const adjustedEnd = match.end + offset;

    redactedText =
      redactedText.slice(0, adjustedStart) +
      replacement +
      redactedText.slice(adjustedEnd);

    offset += replacement.length - (match.end - match.start);
  });

  // Summary for UI
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
