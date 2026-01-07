// cors and security headers middleware config.

import cors from "cors";
import { Request, Response, NextFunction } from "express";

export const corsMiddleware = cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
});

export const securityHeaders = (_req: Request, res: Response, next: NextFunction) => {
    res.header('Cross-Origin-Embedder-Policy', 'require-corp');
    res.header('Cross-Origin-Opener-Policy', 'same-origin');
    next();
};
