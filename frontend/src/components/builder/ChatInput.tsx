// chat input box
import { Send } from 'lucide-react';

interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    disabled: boolean;
    aiName?: string;
}

export function ChatInput({ value, onChange, onSubmit, disabled, aiName }: ChatInputProps) {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!disabled && value.trim()) {
                onSubmit();
            }
        }
    };

    return (
        <div className="p-3 border-t border-gray-800 bg-[#0a0a0a] flex-shrink-0">
            <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Ask ${aiName || 'AI'} to help you...`}
                    className="w-full bg-transparent text-gray-200 placeholder-gray-500 text-sm p-3 pb-2 outline-none resize-none min-h-[60px]"
                    rows={2}
                />
                <div className="px-3 pb-3 flex items-center justify-between">
                    <span className="text-[10px] text-gray-600">
                        Press Enter to send, Shift+Enter for new line
                    </span>
                    <button
                        disabled={disabled || !value.trim()}
                        onClick={onSubmit}
                        className="flex items-center justify-center w-8 h-8 bg-white hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed text-black rounded-full transition-colors"
                    >
                        <Send className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
