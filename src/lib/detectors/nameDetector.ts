import { PIIMatch, PIIType } from "@/types";

const STOPWORDS = new Set([
  "Street","St","Road","Avenue","Email","Phone","Document","Record",
  "Location","Return","Date","Publisher","Department","Employee",
  "Manager","Notes","Notes","Branch"
]);

export function detectNames(text: string): PIIMatch[] {
  const matches: PIIMatch[] = [];

  const NAME_PATTERN = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3})\b/g;

  let match;

  while ((match = NAME_PATTERN.exec(text)) !== null) {
    const phrase = match[1];

    // Avoid false positives
    if (STOPWORDS.has(phrase.split(" ")[0])) continue;
    if (phrase.length < 3) continue;

    matches.push({
      type: PIIType.NAME,
      value: phrase,
      start: match.index,
      end: match.index + phrase.length,
      confidence: 0.70,
    });
  }

  return matches;
}
