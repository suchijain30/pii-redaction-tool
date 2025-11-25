import * as pdfjsLib from "pdfjs-dist";
import { createWorker } from "tesseract.js";

// Use pdf.js worker via CDN
pdfjsLib.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

// =====================================================================
// 1. Extract normal (digital) PDF text
// =====================================================================
export async function extractDigitalPDFText(file: File): Promise<string[]> {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const text = textContent.items
      .map((item: any) => item.str)
      .join(" ")
      .trim();
    pages.push(text);
  }

  return pages;
}

// =====================================================================
// 2. OCR a single page using a Tesseract worker
// =====================================================================
async function ocrPage(worker: any, canvas: HTMLCanvasElement): Promise<string> {
  const {
    data: { text },
  } = await worker.recognize(canvas);
  return text.trim();
}

// =====================================================================
// 3. Extract scanned PDF pages using parallel OCR workers
// =====================================================================
export async function extractScannedPDFText(file: File): Promise<string[]> {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

  const numWorkers = 4;
  const workers = await Promise.all(
    Array.from({ length: numWorkers }).map(() =>
      createWorker("eng") // Remove fast mode - use default for better accuracy
    )
  );

  const pages: Promise<string>[] = [];

  for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
    pages.push(
      (async () => {
        const page = await pdf.getPage(pageNo);

        // INCREASE DPI for better OCR accuracy (scale 2.0-3.0 recommended)
        const viewport = page.getViewport({ scale: 2.5 });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Better preprocessing for OCR accuracy
        // Remove excessive filters that can hurt accuracy
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        await page.render({ canvasContext: ctx, viewport }).promise;

        // Optional: Apply subtle preprocessing AFTER rendering
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Simple binarization for better OCR
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          const value = avg > 128 ? 255 : 0;
          data[i] = data[i + 1] = data[i + 2] = value;
        }
        
        ctx.putImageData(imageData, 0, 0);

        // Assign worker by round-robin
        const worker = workers[pageNo % numWorkers];
        return await ocrPage(worker, canvas);
      })()
    );
  }

  const results = await Promise.all(pages);

  // Terminate workers
  await Promise.all(workers.map((w) => w.terminate()));

  return results;
}

// =====================================================================
// 4. Smart pipeline: use digital → fallback OCR
// =====================================================================
export async function extractTextFromPDF(file: File): Promise<string> {
  // Step A — Try digital text first (VERY FAST)
  const digitalPages = await extractDigitalPDFText(file);

  // Check if meaningful digital text exists (threshold: 50 chars per page avg)
  const totalChars = digitalPages.join("").length;
  const hasDigitalText = totalChars > digitalPages.length * 50;
  
  if (hasDigitalText) {
    return digitalPages.join("\n\n");
  }

  // Step B — Otherwise run parallel OCR (slower but accurate)
  const ocrPages = await extractScannedPDFText(file);
  return ocrPages.join("\n\n");
}