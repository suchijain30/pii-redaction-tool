import { PIIMatch, PIIType } from "@/types";
import { parsePhoneNumberFromString } from "libphonenumber-js";

/**
 * Pre-cleaning to improve OCR consistency.
 */
function cleanInput(raw: string): string {
  return raw
    .replace(/[\u2010-\u2015]/g, "-")    // unicode dashes to "-"
    .replace(/\s+/g, " ")               // normalize whitespace
    .trim();
}

/**
 * Flexible pattern to find possible phone candidates.
 * libphonenumber will validate them.
 */
const PHONE_CANDIDATE_REGEX =
  /(\+?\d[\d\s().\-]{6,20}\d)/g;

/**
 * Advanced global phone detection using libphonenumber-js.
 */
export function detectPhones(text: string): PIIMatch[] {
  const matches: PIIMatch[] = [];
  let match;

  while ((match = PHONE_CANDIDATE_REGEX.exec(text)) !== null) {
    const raw = cleanInput(match[0]);

    // Try parsing as an international phone number
    const phoneObj = parsePhoneNumberFromString(raw, "US"); 
    // Fallback region: US (libphonenumber requirement)

    if (!phoneObj) continue;
    if (!phoneObj.isValid()) continue;

    // Normalized canonical international format
    const normalized = phoneObj.number; // e.g. +12229876543

    // Confidence rules:
    let confidence = 0.9;
    if (raw.includes("+")) confidence += 0.05;
    if (raw.includes("(")) confidence += 0.03;
    if (phoneObj.country) confidence += 0.02;

    matches.push({
      type: PIIType.PHONE,
      value: raw,
      start: match.index,
      end: match.index + raw.length,
      confidence: Math.min(confidence, 1),
    });
  }

  return matches;
}