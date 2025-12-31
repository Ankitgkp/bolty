import { CheckCircle, Circle } from 'lucide-react';
import { Step } from '../types';

interface StepsListProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
}

export function StepsList({ steps, currentStep, onStepClick }: StepsListProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="px-1 py-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-[#808080] flex items-center gap-1.5 ml-1">
          Build Steps
        </h2>
      </div>
      <div className="flex-1 overflow-auto space-y-1 pr-2">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`p-3 rounded-lg cursor-pointer transition-all border ${currentStep === step.id
              ? 'bg-[#252526] border-[#333] shadow-sm'
              : 'hover:bg-[#1e1e1e] border-transparent'
              }`}
            onClick={() => onStepClick(step.id)}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {step.status === 'completed' ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : step.status === 'in-progress' ? (
                  <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                ) : (
                  <Circle className="w-4 h-4 text-[#444]" />
                )}
              </div>
              <div>
                <h3 className={`text-sm font-medium ${currentStep === step.id ? 'text-white' : 'text-[#cccccc]'}`}>{step.title}</h3>
                {step.description && (
                  <p className="text-xs text-[#808080] mt-1 leading-relaxed">{step.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}