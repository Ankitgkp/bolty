// streaming responses from backend chat endpoint
// on the monaco editor

import { useState } from 'react';
import { BACKEND_URL } from '../config';
import { parseXml } from '../steps';
import { Step } from '../types';

interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

export function useLLMChat(setSteps: React.Dispatch<React.SetStateAction<Step[]>>, model?: string) {
    const [llmMessages, setLlmMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);

    async function streamResponse(messages: ChatMessage[]): Promise<string> {
        const response = await fetch(`${BACKEND_URL}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages, model }),
        });

        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = "";

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            fullResponse += chunk;

            const newSteps = parseXml(fullResponse).map((x: Step) => ({
                ...x,
                status: "pending" as "pending",
            }));

            setSteps((s) => {
                const baseSteps = s.filter(
                    (step) => !newSteps.some((ns: Step) => ns.path === step.path && ns.type === step.type)
                );
                return [...baseSteps, ...newSteps];
            });
        }

        return fullResponse;
    }

    async function sendMessage(userPrompt: string): Promise<void> {
        const newMessage: ChatMessage = { role: "user", content: userPrompt };

        setLoading(true);
        setLlmMessages((x) => [...x, newMessage]);

        try {
            const fullResponse = await streamResponse([...llmMessages, newMessage]);
            setLlmMessages((x) => [...x, { role: "assistant", content: fullResponse }]);
        } finally {
            setLoading(false);
        }
    }

    async function initializeChat(prompts: string[], userPrompt: string): Promise<void> {
        const messages: ChatMessage[] = prompts.map((content) => ({ role: "user", content }));
        messages.push({ role: "user", content: userPrompt });

        setLoading(true);

        try {
            const fullResponse = await streamResponse(messages);
            setLlmMessages([...messages, { role: "assistant", content: fullResponse }]);
        } finally {
            setLoading(false);
        }
    }

    return { loading, setLoading, sendMessage, initializeChat };
}
