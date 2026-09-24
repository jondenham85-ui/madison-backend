import express from "express";
import os from "os";

const router = express.Router();

router.get("/system", (req, res) => {
  res.json({
    backend: "online",
    chat: "online",
    voice: "online",
    model: "GPT-4o",
    version: "1.0.0",
    uptime: `${os.uptime()} seconds`,
  });
});

export default router;
