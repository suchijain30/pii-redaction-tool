export enum PIIType {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  NAME = 'NAME',
  ADDRESS = 'ADDRESS'
}

export interface PIIMatch {
  type: PIIType;
  value: string;
  start: number;
  end: number;
  confidence: number;
}

export interface RedactionOptions {
  enabledTypes: Set<PIIType>;
  redactionStyle: 'blackout' | 'labeled';
}


export interface RedactionResult {
  originalText: string;
  redactedText: string;
  matches: PIIMatch[];
  summary: Record<string, number>;
}