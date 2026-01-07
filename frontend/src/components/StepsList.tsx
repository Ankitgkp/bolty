/**
 * Build steps list showing progress of file generation.
 */

import { CheckCircle, Circle, FileText, Terminal, Loader2 } from 'lucide-react';
import { Step, StepType } from '../types';

interface StepsListProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
}

export function StepsList({ steps, currentStep, onStepClick }: StepsListProps) {
  return (
    <div className="h-full flex flex-col bg-[#1a1a1a]">
      <div className="px-4 py-4 border-b border-[#333]">
        <h2 className="text-sm font-semibold text-gray-200">
          Build Steps
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Follow the progress of your application build
        </p>
      </div>
      <div className="flex-1 overflow-auto p-2 space-y-2">
        {steps.map((step) => {
          const isCurrent = currentStep === step.id;
          const isCompleted = step.status === 'completed';
          const isInProgress = step.status === 'in-progress';

          return (
            <div
              key={step.id}
              className={`group relative flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border ${isCurrent
                ? 'bg-[#252526] border-blue-500/30 ring-1 ring-blue-500/20'
                : 'bg-[#1e1e1e] border-[#333] hover:border-[#444] hover:bg-[#252526]'
                }`}
              onClick={() => onStepClick(step.id)}
            >
              <div className="flex-shrink-0 mt-0.5">
                {isCompleted ? (
                  <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  </div>
                ) : isInProgress ? (
                  <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />
                  </div>
                ) : (
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isCurrent ? 'bg-gray-700' : 'bg-gray-800'}`}>
                    <Circle className={`w-3.5 h-3.5 ${isCurrent ? 'text-gray-300' : 'text-gray-600'}`} />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`text-sm font-medium truncate ${isCurrent || isCompleted ? 'text-gray-200' : 'text-gray-500'
                    }`}>
                    {step.title}
                  </h3>
                  <span className="text-[10px] text-gray-600 font-mono uppercase px-1.5 py-0.5 rounded border border-gray-800 bg-gray-900/50">
                    {step.type === StepType.CreateFile ? 'File' : 'Shell'}
                  </span>
                </div>
                {step.description && (
                  <p className={`text-xs leading-relaxed line-clamp-2 ${isCurrent ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                    {step.description}
                  </p>
                )}
                {step.path && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500 font-mono bg-black/20 px-2 py-1 rounded w-fit">
                    {step.type === StepType.CreateFile ? (
                      <FileText className="w-3 h-3" />
                    ) : (
                      <Terminal className="w-3 h-3" />
                    )}
                    <span className="truncate max-w-[150px]">{step.path}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}