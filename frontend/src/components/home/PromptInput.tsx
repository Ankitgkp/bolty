// prompt input box form

import { FormEvent } from 'react';
import { ArrowUp } from 'lucide-react';
import { Textarea, IconButton, Card, CardContent, CardFooter } from '../ui';
import { ModelSelector } from './ModelSelector';

interface PromptInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: (e: FormEvent) => void;
}

export function PromptInput({ value, onChange, onSubmit }: PromptInputProps) {
    return (
        <Card className="overflow-visible">
            <form onSubmit={onSubmit}>
                <CardContent>
                    <Textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Type / for commands"
                        className="h-16 text-lg font-light font-serif"
                        style={{ minHeight: '4rem' }}
                    />
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                    <ModelSelector selectedModel="Devstral 4.5" />
                    <SubmitButton disabled={!value.trim()} />
                </CardFooter>
            </form>
        </Card>
    );
}

interface SubmitButtonProps {
    disabled: boolean;
}

function SubmitButton({ disabled }: SubmitButtonProps) {
    return (
        <IconButton type="submit" disabled={disabled} variant="primary">
            <ArrowUp className="w-5 h-5" />
        </IconButton>
    );
}
