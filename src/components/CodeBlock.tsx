import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export const CodeBlock = ({ code, language = "bash", title }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      {title && (
        <div className="bg-secondary px-4 py-2 text-sm font-medium rounded-t-lg border border-b-0">
          {title}
        </div>
      )}
      <div className={`relative bg-code-bg border border-code-border ${title ? 'rounded-b-lg' : 'rounded-lg'} overflow-hidden`}>
        <Button
          onClick={copyToClipboard}
          size="sm"
          variant="ghost"
          className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied ? (
            <Check className="h-4 w-4 text-accent" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
        <pre className="p-4 overflow-x-auto text-sm">
          <code className={`language-${language} text-foreground`}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
};