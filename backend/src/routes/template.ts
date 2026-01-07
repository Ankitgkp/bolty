// this checks whether the project is a react or node project based on user prompt
// and returns the appropriate base prompt to the LLM

import { Router, Request, Response } from "express";
import { openrouter } from "../services/openrouter.js";
import { config } from "../config/index.js";
import { BASE_PROMPT } from "../prompts.js";
import { basePrompt as nodeBasePrompt } from "../defaults/node.js";
import { basePrompt as reactBasePrompt } from "../defaults/react.js";

const router = Router();

const CLASSIFIER_PROMPT = `You are a project classifier. Your ONLY task is to return either 'node' or 'react'.

- Return 'react' if the project is a web app, UI, frontend, or visual website.
- Return 'node' if it is a CLI, script, backend, or server-only project.

CRITICAL: DO NOT return any other text, reasoning, or explanation. ONLY return the word 'react' or 'node'.`;

const buildArtifactPrompt = (basePrompt: string): string => {
    return `Here is an artifact that contains all files of the project visible to you.
Consider the contents of ALL files in the project.

${basePrompt}

Here is a list of files that exist on the file system but are not being shown to you:

  - .gitignore
  - package-lock.json
`;
};

router.post("/", async (req: Request, res: Response) => {
    try {
        const prompt = req.body.prompt;

        if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
            res.status(400).json({ message: "Prompt is required" });
            return;
        }

        const response = await openrouter.chat.send({
            model: config.aiModel,
            messages: [
                { role: "system", content: CLASSIFIER_PROMPT },
                { role: "user", content: prompt }
            ]
        });

        const content = response.choices[0]?.message?.content;
        console.log("Template classification response:", content);
        
        const answer = (typeof content === 'string' ? content : '').toLowerCase();
        const isReact = answer.includes("react");
        const basePrompt = isReact ? reactBasePrompt : nodeBasePrompt;

        console.log("Selected template:", isReact ? "react" : "node");

        res.json({
            prompts: [BASE_PROMPT, buildArtifactPrompt(basePrompt)],
            uiPrompts: [basePrompt]
        });
    } catch (error) {
        console.error('Error in /template:', error);
        res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router;
