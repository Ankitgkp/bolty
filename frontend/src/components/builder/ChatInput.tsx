// chat input box
import { Textarea, IconButton } from '../ui';

interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    disabled: boolean;
}

export function ChatInput({ value, onChange, onSubmit, disabled }: ChatInputProps) {
    return (
        <div className="p-4 border-t border-[#333] bg-[#1e1e1e] flex-shrink-0">
            <div className="relative">
                <Textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Ask bolt to help you today..."
                    variant="dark"
                    className="p-3 h-24"
                />
                <div className="absolute bottom-3 right-3">
                    <IconButton
                        disabled={disabled || !value.trim()}
                        onClick={onSubmit}
                        variant="secondary"
                        size="sm"
                    >
                        <SendIcon />
                    </IconButton>
                </div>
            </div>
        </div>
    );
}

function SendIcon() {
    return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
        </svg>
    );
}
