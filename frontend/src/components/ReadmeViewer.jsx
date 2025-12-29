import ReactMarkdown from "react-markdown";
import { Copy, Download, Check } from "lucide-react";
import { useState } from "react";

export default function ReadmeViewer({ content }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden">
      <div className="border-b border-neutral-700 p-4 flex justify-between items-center bg-neutral-800/50">
        <span className="text-sm font-medium text-neutral-400">
          README.md Preview
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-neutral-700 rounded-md transition-colors text-neutral-400 hover:text-white"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="h-5 w-5 text-emerald-400" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-neutral-700 rounded-md transition-colors text-neutral-400 hover:text-white"
            title="Download README.md"
          >
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="p-8 prose prose-invert prose-blue max-w-none prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-700">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
