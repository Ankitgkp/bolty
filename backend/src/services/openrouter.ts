
// providing openrouter client for AI interactions

import { OpenRouter } from "@openrouter/sdk";
import { config } from "../config/index.js";

export const openrouter = new OpenRouter({
    apiKey: config.openRouterApiKey!
});
