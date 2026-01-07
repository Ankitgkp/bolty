// api for backend communication for template and chat generation
import axios from 'axios';
import { BACKEND_URL } from '../config';

export interface TemplateResponse {
    prompts: string[];
    uiPrompts: string[];
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export async function getTemplate(prompt: string): Promise<TemplateResponse> {
    const response = await axios.post(`${BACKEND_URL}/template`, {
        prompt: prompt.trim()
    });
    return response.data;
}

export async function streamChat(
    messages: ChatMessage[],
    onChunk: (chunk: string, fullResponse: string) => void
): Promise<string> {
    const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
    });

    if (!response.body) {
        throw new Error('No response body');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullResponse += chunk;
        onChunk(chunk, fullResponse);
    }

    return fullResponse;
}
