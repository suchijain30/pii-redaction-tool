import { PIIMatch, PIIType } from "@/types";

const EMAIL_REGEX =
  /([a-zA-Z0-9._%+-]+)\s*(?:@|\s*\(?@\)?\s*)\s*([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

export function detectEmails(text: string): PIIMatch[] {
  const matches: PIIMatch[] = [];
  let match;

  while ((match = EMAIL_REGEX.exec(text)) !== null) {
    const raw = match[0]
      .replace(/\s+/g, "")
      .replace(/\(\s*@\s*\)/, "@");

    matches.push({
      type: PIIType.EMAIL,
      value: raw,
      start: match.index,
      end: match.index + match[0].length,
      confidence: 0.95,
    });
  }

  return matches;
}
