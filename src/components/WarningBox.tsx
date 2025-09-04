import { AlertTriangle } from "lucide-react";
import { ReactNode } from "react";

interface WarningBoxProps {
  children: ReactNode;
  title?: string;
}

export const WarningBox = ({ children, title = "Important" }: WarningBoxProps) => {
  return (
    <div className="bg-warning-bg border border-warning-border rounded-lg p-4 flex gap-3">
      <AlertTriangle className="w-5 h-5 text-warning-border flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="font-semibold text-warning-border mb-1">{title}</h4>
        <div className="text-sm text-foreground">{children}</div>
      </div>
    </div>
  );
};