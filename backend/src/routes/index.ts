// combining all routes

import { Router } from "express";
import healthRouter from "./health.js";
import templateRouter from "./template.js";
import chatRouter from "./chat.js";

const router = Router();

router.use("/", healthRouter);
router.use("/template", templateRouter);
router.use("/chat", chatRouter);

export default router;
