require("dotenv").config();
import express from "express";
import cors from "cors";
import { OpenRouter } from "@openrouter/sdk";
import { BASE_PROMPT, getSystemPrompt } from "./prompts";
import { basePrompt as nodeBasePrompt } from "./defaults/node";
import { basePrompt as reactBasePrompt } from "./defaults/react";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not set in environment variables');
}

const openrouter = new OpenRouter({
    apiKey: OPENROUTER_API_KEY
});

const app = express();
app.use(cors());
app.use(express.json());

// Add headers for Cross-Origin Isolation (required for WebContainers)
app.use((req, res, next) => {
    res.header('Cross-Origin-Embedder-Policy', 'require-corp');
    res.header('Cross-Origin-Opener-Policy', 'same-origin');
    next();
});

app.get("/", (req, res) => {
    res.json({ status: "Server is running", message: "Bolt Backend API" });
});

app.post("/template", async (req, res) => {
    try {
        const prompt = req.body.prompt;

        if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
            res.status(400).json({ message: "Prompt is required" });
            return;
        }

        const response = await openrouter.chat.send({
            model: "mistralai/devstral-2512:free",
            messages: [
                {
                    role: "system",
                    content: "You are a project classifier. Your ONLY task is to return either 'node' or 'react'.\n\n- Return 'react' if the project is a web app, UI, frontend, or visual website.\n- Return 'node' if it is a CLI, script, backend, or server-only project.\n\nCRITICAL: DO NOT return any other text, reasoning, or explanation. ONLY return the word 'react' or 'node'."
                },
                {
                    role: "user",
                    content: prompt
                }
            ]
        });

        const content = response.choices[0]?.message?.content;
        console.log("Template classification response:", content);
        const answer = (typeof content === 'string' ? content : '').toLowerCase();

        let templateType = "node"; // Default to node
        if (answer.includes("react")) {
            templateType = "react";
        } else if (answer.includes("node")) {
            templateType = "node";
        }

        console.log("Selected template:", templateType);

        if (templateType === "react") {
            res.json({
                prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [reactBasePrompt]
            })
            return;
        }

        if (answer === "node") {
            res.json({
                prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [nodeBasePrompt]
            })
            return;
        }

        res.status(403).json({ message: "You cant access this" })
        return;
    } catch (error) {
        console.error('Error in /template:', error);
        res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
})

app.post("/chat", async (req, res) => {
    try {
        const messages = req.body.messages;
        console.log("Chat endpoint received body:", JSON.stringify(req.body).substring(0, 200));

        if (!messages || !Array.isArray(messages)) {
            res.status(400).json({ message: "Messages array is required" });
            return;
        }

        const stream = await openrouter.chat.send({
            model: "mistralai/devstral-2512:free",
            messages: [
                {
                    role: "system",
                    content: getSystemPrompt()
                },
                ...messages.map((msg: any) => ({
                    role: msg.role === 'assistant' ? 'assistant' as const : 'user' as const,
                    content: typeof msg.content === 'string' ? msg.content : msg.content[0]?.text || ''
                }))
            ],
            stream: true,
            streamOptions: {
                includeUsage: true
            }
        });

        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Content-Type-Options', 'nosniff');

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
                res.write(content);
                // @ts-ignore
                if (res.flush) res.flush();
            }
        }

        res.end();
    } catch (error) {
        console.error('Error in /chat:', error);
        if (!res.headersSent) {
            res.status(500).json({
                message: "Internal server error",
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        } else {
            res.end();
        }
    }
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
});

