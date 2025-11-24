"use client";

import React from "react";
import { RedactionResult } from "@/types";
import { generateRedactedPDF } from "@/lib/generateRedactedPDF";

interface Props {
  result: RedactionResult;
}

export default function RedactionDisplay({ result }: Props) {
  const downloadPDF = async () => {
    const blob = await generateRedactedPDF(result.redactedText);
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "redacted_output.pdf";
    a.click();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <h3 className="text-lg font-bold mb-4">Redaction Results</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original */}
        <div>
          <h4 className="font-semibold mb-2">Original Text</h4>
          <div className="p-4 bg-gray-100 rounded-lg whitespace-pre-wrap min-h-40">
            {result.originalText}
          </div>
        </div>

        {/* Redacted */}
        <div>
          <h4 className="font-semibold mb-2">Redacted Text</h4>
          <div className="p-4 bg-gray-200 rounded-lg whitespace-pre-wrap min-h-40">
            {result.redactedText}
          </div>

          {/* Download Button */}
          <button
            onClick={downloadPDF}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            ⬇ Download Redacted PDF
          </button>
        </div>
      </div>
    </div>
  );
}
