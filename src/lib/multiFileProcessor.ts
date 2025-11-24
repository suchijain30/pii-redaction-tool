import { extractFileText } from "./fileExtractor";

export async function processMultipleFiles(files: File[]) {
  const results = await Promise.all(
    files.map(async (file) => ({
      fileName: file.name,
      text: await extractFileText(file)
    }))
  );

  return results;
}
