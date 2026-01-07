// hooks for init builder wtih template and chat

import { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { parseXml } from '../steps';
import { Step } from '../types';

interface UseBuilderInitProps {
    prompt: string;
    setSteps: React.Dispatch<React.SetStateAction<Step[]>>;
    initializeChat: (prompts: string[], userPrompt: string) => Promise<void>;
}

export function useBuilderInit({ prompt, setSteps, initializeChat }: UseBuilderInitProps) {
    const [templateSet, setTemplateSet] = useState(false);

    useEffect(() => {
        async function init() {
            try {
                const templateResponse = await axios.post(`${BACKEND_URL}/template`, {
                    prompt: prompt.trim(),
                });
                setTemplateSet(true);

                const { prompts, uiPrompts } = templateResponse.data;

                setSteps(
                    parseXml(uiPrompts[0]).map((x: Step) => ({
                        ...x,
                        status: "pending",
                    }))
                );

                await initializeChat(prompts, prompt);
            } catch (error) {
                console.error("Error during initialization:", error);
                alert("Failed to generate content. Please try again.");
            }
        }

        if (prompt) {
            init();
        }
    }, []);

    return { templateSet };
}
