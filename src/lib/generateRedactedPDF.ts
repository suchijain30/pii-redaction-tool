import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function generateRedactedPDF(text: string): Promise<Blob> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage();

  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;

  const { width, height } = page.getSize();
  const margin = 40;
  const maxWidth = width - margin * 2;
  let y = height - margin;

  // Split text by newlines safely
  const paragraphs = text.split("\n");

  paragraphs.forEach((para) => {
    const words = para.split(" ");
    let line = "";

    words.forEach((word) => {
      const testLine = line + word + " ";
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (testWidth > maxWidth) {
        // Draw current line
        page.drawText(line, {
          x: margin,
          y,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
        line = word + " ";
        y -= fontSize + 4;
      } else {
        line = testLine;
      }
    });

    // Draw last line of the paragraph
    if (line.trim() !== "") {
      page.drawText(line, {
        x: margin,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      y -= fontSize + 10; // extra spacing for new paragraph
    }
  });

  const pdfBytes = await pdf.save();

  // Convert to safe ArrayBuffer (no SharedArrayBuffer)
  const safeBuffer = pdfBytes.slice().buffer;

  return new Blob([safeBuffer], { type: "application/pdf" });
}