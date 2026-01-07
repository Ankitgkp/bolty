// this is the chat streaming endpoint for AI interactions for now using openrouter API

import { Router, Request, Response } from "express";
import { openrouter } from "../services/openrouter.js";
import { config } from "../config/index.js";
import { getSystemPrompt } from "../prompts.js";

const router = Router();

const formatMessages = (messages: any[]) => {
    return messages.map((msg: any) => ({
        role: msg.role === 'assistant' ? 'assistant' as const : 'user' as const,
        content: typeof msg.content === 'string' ? msg.content : msg.content[0]?.text || ''
    }));
};

const setStreamHeaders = (res: Response) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Content-Type-Options', 'nosniff');
};

router.post("/", async (req: Request, res: Response) => {
    try {
        const messages = req.body.messages;
        console.log("Chat endpoint received body:", JSON.stringify(req.body).substring(0, 200));

        if (!messages || !Array.isArray(messages)) {
            res.status(400).json({ message: "Messages array is required" });
            return;
        }

        const stream = await openrouter.chat.send({
            model: config.aiModel,
            messages: [
                { role: "system", content: getSystemPrompt() },
                ...formatMessages(messages)
            ],
            stream: true,
            streamOptions: { includeUsage: true }
        });

        setStreamHeaders(res);

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
});

export default router;
