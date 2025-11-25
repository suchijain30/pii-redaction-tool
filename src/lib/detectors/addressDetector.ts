import { PIIMatch, PIIType } from "@/types";

const ADDRESS_KEYWORDS = [
  "street","st","road","rd","avenue","ave","lane","ln","boulevard","blvd",
  "sector","plot","block","village","colony","city","state","zip","postal",
  "district","taluk","pincode","county","apartment","apt","flat","near"
];

const ADDRESS_REGEX =
  /\b(\d{1,5}\s+[A-Za-z0-9.,\-\s]{5,60})\b/g;

export function detectAddresses(text: string): PIIMatch[] {
  const matches: PIIMatch[] = [];
  let match;

  while ((match = ADDRESS_REGEX.exec(text)) !== null) {
    const raw = match[1];

    // keyword boosting — must include one address keyword
    const rawLower = raw.toLowerCase();
    const hasKeyword = ADDRESS_KEYWORDS.some(k => rawLower.includes(k));

    if (!hasKeyword) continue;

    matches.push({
      type: PIIType.ADDRESS,
      value: raw,
      start: match.index,
      end: match.index + raw.length,
      confidence: 0.85,
    });
  }

  return matches;
}