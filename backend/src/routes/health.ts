// health check route

import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
    res.json({ status: "Server is running", message: "Bolt Backend API" });
});

export default router;
