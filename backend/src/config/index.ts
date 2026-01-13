// exporting port and openrouter API key.
import 'dotenv/config';

export const config = {
    port: process.env.PORT || 3000,
    openRouterApiKey: process.env.OPENROUTER_API_KEY,
    aiModel: process.env.AI_MODEL || "xiaomi/mimo-v2-flash:free",
    jwtSecret: process.env.JWT_SECRET || "ankit123"
};

if (!config.openRouterApiKey) {
    throw new Error('OPENROUTER_API_KEY environment variables is not set');
}
