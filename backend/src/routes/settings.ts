
import { Router } from "express";
import { aiSettings } from "../config/aiSettings.js";

const router = Router();

router.get("/", (req, res) => {
    res.json(aiSettings);
});

export default router;
