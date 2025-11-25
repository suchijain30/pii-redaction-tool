'use client';

import { useState, useCallback } from 'react';
import { PIIType, RedactionOptions, RedactionResult } from '@/types';
import { redactText } from '@/lib/redactor';
import FileUploader from '@/components/FileUploader';
import TextInput from '@/components/TextInput';
import RedactionDisplay from '@/components/RedactionDisplay';
import Controls from '@/components/Controls';
import { AlertCircle } from 'lucide-react';



export default function Home() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<RedactionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileTexts, setFileTexts] = useState<{ fileName: string; text: string }[]>([]);
  const [options, setOptions] = useState<RedactionOptions>({
    enabledTypes: new Set([PIIType.EMAIL, PIIType.PHONE, PIIType.NAME, PIIType.ADDRESS]),
    redactionStyle: 'blackout'
  });


  const handleRedact = useCallback(() => {
    if (!inputText.trim()) {
      setError('Please enter some text or upload a file');
      return;
    }

    if (options.enabledTypes.size === 0) {
      setError('Please select at least one PII type to detect');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Simulate processing delay for better UX
      setTimeout(() => {
        const redactionResult = redactText(inputText, options);
        setResult(redactionResult);
        setIsProcessing(false);
      }, 300);
    } catch (err) {
      setError('An error occurred during redaction. Please try again.');
      setIsProcessing(false);
    }
  }, [inputText, options]);

  const handleClear = () => {
    setInputText('');
    setResult(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                🔒 PII Redaction Tool
              </h1>
              <p className="text-gray-600 mt-2">
                Automatically detect and redact personally identifiable information
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Built with TypeScript</p>
              <p className="text-xs text-gray-400">Next.js + React</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="text-red-600" size={24} />
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Input */}
          <div className="lg:col-span-3 space-y-6">
            <FileUploader onTextExtracted={(combined, perFile) => {setInputText(combined); setFileTexts(perFile);      // store each file's extracted text
            }}/>
            <TextInput value={inputText} onChange={setInputText} />

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleRedact}
                disabled={!inputText.trim() || isProcessing}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold transition flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    🔍 Detect and Redact PII
                  </>
                )}
              </button>
              <button
                onClick={handleClear}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition"
              >
                Clear All
              </button>
            </div>

            {/* Results */}
            {result && <RedactionDisplay result={result} />}
          </div>

          {/* Right Panel - Controls */}
          <div className="space-y-6">
            <Controls options={options} onChange={setOptions} />

            {/* Stats Card */}
            {result && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="font-semibold mb-3">Quick Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Original Length:</span>
                    <span className="font-mono">{result.originalText.length} chars</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Redacted Length:</span>
                    <span className="font-mono">{result.redactedText.length} chars</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Detections:</span>
                    <span className="font-bold text-blue-600">{result.matches.length}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Sample Data */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2 text-sm">💡 Try Sample Data</h3>
              <button
                onClick={() => setInputText(`Contact Information:
Name: John Smith
Email: john.smith@example.com
Phone: (555) 123-4567
Address: 123 Main Street, Springfield

Name: Jane Doe
Email: jane.doe@company.com
Phone: +1-555-987-6543
Address: 456 Oak Avenue, Portland`)}
                className="w-full mt-2 px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition"
              >
                Load Sample Text
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <p>© 2025 PII Redaction Tool. Built by Suchi Jain</p>
            <p>All processing is done locally in your browser</p>
          </div>
        </div>
      </footer>
    </main>
  );
}