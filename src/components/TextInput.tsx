"use client";
import React from "react";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function TextInput({ value, onChange }: Props) {
  return (
    <textarea
      className="w-full border p-3 rounded-lg min-h-40"
      placeholder="Enter text to redact..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}