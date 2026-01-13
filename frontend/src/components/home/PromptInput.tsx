// prompt input box form

import { FormEvent } from "react";
import { ChevronRight } from "lucide-react";
import { ModelSelector } from "./ModelSelector";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  model: string;
  onModelChange: (model: string) => void;
}

export function PromptInput({ value, onChange, onSubmit, model, onModelChange }: PromptInputProps) {
  return (
    <div className="w-full bg-[#1a1a1a] rounded-xl border border-gray-800 hover:border-gray-700 transition-colors shadow-xl">
      <form onSubmit={onSubmit}>
        <div className="p-4 pb-3">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your prompt here..."
            className="w-full bg-transparent text-gray-200 placeholder-gray-500 text-base outline-none resize-none min-h-[60px]"
            rows={2}
          />
        </div>

        <div className="px-4 pb-4 flex items-center justify-between border-gray-800 pt-3">
          <div className="flex items-center gap-3">
            <ModelSelector model={model} setModel={onModelChange} />
            <span className="text-xs text-gray-500">Free forever</span>
          </div>
          <button
            type="submit"
            disabled={!value.trim()}
            className="flex items-center justify-center w-9 h-9 bg-white hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-black rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
