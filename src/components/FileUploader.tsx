"use client";

import React from "react";
import { processMultipleFiles } from "@/lib/multiFileProcessor";

interface Props {
  onTextExtracted: (combinedText: string, perFile: { fileName: string; text: string }[]) => void;
}

export default function FileUploader({ onTextExtracted }: Props) {

  const handleFiles = async (files: File[]) => {
    const results = await processMultipleFiles(files);

    const combined = results
      .map(r => `\n\n===== ${r.fileName} =====\n\n${r.text}`)
      .join("\n");

    onTextExtracted(combined, results);
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <input
        type="file"
        accept=".pdf,.txt,.doc,.docx,.rtf,.json,.csv"
        multiple
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFiles(Array.from(e.target.files));
          }
        }}
      />
      <p className="text-sm text-gray-600 mt-2">
        Upload PDF, TXT, DOCX, RTF, JSON, CSV (multiple allowed)
      </p>
    </div>
  );
}
