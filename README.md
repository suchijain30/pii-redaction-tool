🔒 PII Redaction Tool

A Next.js + TypeScript powered application to detect and redact Personally Identifiable Information from documents.

This project extracts text from multiple file formats (PDF, scanned PDF, TXT, DOCX, RTF, CSV, JSON), detects sensitive PII using regex-based detectors, and generates a legally compliant redacted PDF using blackout rectangles (#).

Supports OCR (Optical Character Recognition) for scanned PDFs.

Live Demo (once deployed):

https://YOUR-DEPLOYED-URL.vercel.app

✨ Features
🔍 PII Detection

Detects the following PII types:

📧 Email Addresses

📱 Phone Numbers

🧑 Names

📍 Addresses

🛡 Redaction

Two modes:

Blackout boxes (#) inside exported PDF

Labeled redaction (e.g., [EMAIL], [PHONE]) in UI

📂 Multi-File Upload Support

Upload multiple documents together:

.pdf (digital + scanned)

.txt

.doc / .docx

.rtf

.csv

.json

📄 PDF Generation

Export final redacted text into a new PDF

Uses solid black rectangles for real legal redaction

Supports multi-line wrapping, paragraphs, and Unicode-safe text

🧠 OCR Support (Scanned PDFs)

Scanned PDFs are processed via:

pdfjs-dist (page rendering)

Tesseract.js (OCR engine)

Parallel worker threads for speed

DPI optimization & preprocessing for accuracy

⚡ Performance Optimizations

Parallel OCR using 4 workers

Text-based PDF detection (skip OCR when possible)

Reduced DPI for faster processing

Preprocessing: grayscale + contrast boost

🎨 Modern UI

Built with Next.js App Router

TailwindCSS styling

Fully responsive interface

🧪 Tech Stack
Frontend

Next.js 14+ (App Router)

React 18

TypeScript

Tailwind CSS

Document Processing

pdfjs-dist → Extract text from digital PDFs

Tesseract.js → OCR for scanned PDFs

Mammoth.js → Extract text from .docx files

Custom extractors → For CSV, TXT, JSON, RTF

Redaction & PDF Generation

pdf-lib → Create new redacted PDF

Custom blackout rectangle renderer

📁 Folder Structure
pii-redaction-tool/
│
├── src/
│   ├── app/             # Next.js pages & layout
│   ├── components/      # UI components
│   ├── lib/             # OCR, PDF processing, redaction logic
│   ├── types/           # TypeScript types
│
├── public/              # Static assets
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── next.config.js
└── README.md

🚀 Getting Started (Local Development)
1. Clone the repository
git clone https://github.com/suchijain30/pii-redaction-tool.git
cd pii-redaction-tool

2. Install dependencies
npm install

3. Run development server
npm run dev


Open → http://localhost:3000

📦 Build for Production
npm run build
npm start

🌐 Deployment (Vercel Recommended)

Deploy in one click:

Go to https://vercel.com

Import your repository

Click Deploy

Vercel automatically detects:

Next.js

Tailwind

Typescript

No configuration needed.

🧩 How OCR Works
Step 1 — Detect if PDF has digital text
extractDigitalPDFText()


If text exists → return directly (instant, no OCR)

Step 2 — Otherwise run OCR

Render each page via pdf.js

Use Tesseract worker threads

Preprocess image

Extract text

Combine all pages

Step 3 — Send extracted text into redaction pipeline
🔏 How Redaction Works

PII Detectors:

Email → Regex

Phone → Regex

Name → NLP-like patterns

Address → Regex

Redaction Output:
✔ UI → Labeled or Blackout
✔ PDF → Solid black rectangles drawn using pdf-lib

📥 Multi-File Processing Flow

Select multiple files

Extract each file’s text

Merge all text with headers:

===== file1.pdf =====
extracted text...


Run PII detection

Show redacted results

Export to PDF

📷 Screenshots (Optional)
Include your app screenshots here like:
![UI Preview](public/screenshot.png)

🧑‍💻 Author

Suchi Jain
B.Tech CSE
GitHub: https://github.com/suchijain30

📜 License

This project is open-source and available under the MIT License.

If you want, I can also:

👉 Add a logo
👉 Add badges (Build passing, License, Stars, etc.)
👉 Add a GIF demo
👉 Add a project tagline
👉 Improve the UI screenshots