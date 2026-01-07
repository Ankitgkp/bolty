// exporting port and openrouter API key.
import 'dotenv/config';

export const config = {
    port: process.env.PORT || 3000,
    openRouterApiKey: process.env.OPENROUTER_API_KEY,
    aiModel: "mistralai/devstral-2512:free"
};

if (!config.openRouterApiKey) {
    throw new Error('OPENROUTER_API_KEY is not set in environment variables');
}
