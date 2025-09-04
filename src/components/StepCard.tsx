import { ReactNode } from "react";
import { CheckCircle } from "lucide-react";

interface StepCardProps {
  stepNumber: number;
  title: string;
  children: ReactNode;
  completed?: boolean;
}

export const StepCard = ({ stepNumber, title, children, completed = false }: StepCardProps) => {
  return (
    <div className="relative">
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
          completed 
            ? 'bg-step-complete text-white' 
            : 'bg-step-bg text-white'
        }`}>
          {completed ? <CheckCircle className="w-5 h-5" /> : stepNumber}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold mb-4 text-foreground">{title}</h3>
          <div className="space-y-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};