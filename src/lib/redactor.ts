import { PIIMatch, RedactionOptions, RedactionResult, PIIType } from '@/types';
import { detectEmails } from './detectors/emailDetector';
import { detectPhones } from './detectors/phoneDetector';
import { detectNames } from './detectors/nameDetector';
import { detectAddresses } from './detectors/addressDetector';

function removeOverlaps(matches: PIIMatch[]): PIIMatch[] {
  const result: PIIMatch[] = [];

  for (const match of matches) {
    const overlaps = result.some(
      (existing) =>
        (match.start >= existing.start && match.start < existing.end) ||
        (match.end > existing.start && match.end <= existing.end)
    );

    if (!overlaps) result.push(match);
  }

  return result;
}

export function redactText(text: string, options: RedactionOptions): RedactionResult {
  let allMatches: PIIMatch[] = [];

  // Collect based on enabled types
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

  // Sort + remove overlaps
  allMatches.sort((a, b) => a.start - b.start);
  const uniqueMatches = removeOverlaps(allMatches);

  // Per-type counters
  const counters: Record<PIIType, number> = {
    [PIIType.EMAIL]: 0,
    [PIIType.PHONE]: 0,
    [PIIType.NAME]: 0,
    [PIIType.ADDRESS]: 0,
  };

  // Lowercase label map
  const labelMap: Record<PIIType, string> = {
    [PIIType.EMAIL]: 'email',
    [PIIType.PHONE]: 'phone',
    [PIIType.NAME]: 'name',
    [PIIType.ADDRESS]: 'address',
  };

  let redactedText = text;
  let offset = 0;

  uniqueMatches.forEach((match) => {
    counters[match.type] += 1;

    // ALWAYS use label style, no blackout
    const label = labelMap[match.type];
    const replacement = `[${label}${counters[match.type]}]`;

    const adjustedStart = match.start + offset;
    const adjustedEnd = match.end + offset;

    redactedText =
      redactedText.slice(0, adjustedStart) +
      replacement +
      redactedText.slice(adjustedEnd);

    offset += replacement.length - (match.end - match.start);
  });

  // Summary
  const summary = uniqueMatches.reduce((acc, match) => {
    acc[match.type] = (acc[match.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    originalText: text,
    redactedText,
    matches: uniqueMatches,
    summary,
  };
}
