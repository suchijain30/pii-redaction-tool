"use client";

import React from "react";
import { RedactionOptions, PIIType } from "@/types";

interface Props {
  options: RedactionOptions;
  onChange: (o: RedactionOptions) => void;
}

export default function Controls({ options, onChange }: Props) {
  const togglePII = (type: PIIType) => {
    const newSet = new Set(options.enabledTypes);

    if (newSet.has(type)) {
      newSet.delete(type);
    } else {
      newSet.add(type);
    }

    onChange({
      ...options,
      enabledTypes: newSet
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-3">
      <h3 className="font-semibold text-gray-700 text-sm">PII Types to Redact</h3>

      {([
        [PIIType.EMAIL, "Emails"],
        [PIIType.PHONE, "Phone Numbers"],
        [PIIType.NAME, "Names"],
        [PIIType.ADDRESS, "Addresses"]
      ] as const).map(([type, label]) => (
        <label key={type} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={options.enabledTypes.has(type)}
            onChange={() => togglePII(type)}
          />
          {label}
        </label>
      ))}
    </div>
  );
}
