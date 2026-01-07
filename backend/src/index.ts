// main entry point for backend server

import express from "express";
import { config } from "./config/index.js";
import { corsMiddleware, securityHeaders } from "./middleware/cors.js";
import routes from "./routes/index.js";

const app = express();

app.use(corsMiddleware); 
app.use(express.json()); 
app.use(securityHeaders);
app.use(routes);

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});

