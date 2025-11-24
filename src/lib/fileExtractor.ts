import { extractTextFromPDF } from "./pdfProcessor";
import mammoth from "mammoth";

// Extract from TXT
async function extractTXT(file: File): Promise<string> {
  return await file.text();
}

// Extract from DOCX / DOC using Mammoth
async function extractDOCX(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

// Extract from RTF
async function extractRTF(file: File): Promise<string> {
  const content = await file.text();
  return content
    .replace(/\\par[d]?/g, "\n")
    .replace(/\\'[0-9a-fA-F]{2}/g, "")
    .replace(/{|}|\\[^ ]+/g, "")
    .trim();
}

// Extract from JSON
async function extractJSON(file: File): Promise<string> {
  const json = JSON.parse(await file.text());
  return JSON.stringify(json, null, 2);
}

// Extract from CSV
async function extractCSV(file: File): Promise<string> {
  return await file.text();
}

// Unified extractor
export async function extractFileText(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "pdf":
      return await extractTextFromPDF(file);

    case "txt":
      return await extractTXT(file);

    case "doc":
    case "docx":
      return await extractDOCX(file);

    case "rtf":
      return await extractRTF(file);

    case "json":
      return await extractJSON(file);

    case "csv":
      return await extractCSV(file);

    default:
      return `Unsupported file type: ${file.name}`;
  }
}
