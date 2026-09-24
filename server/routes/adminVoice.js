import express from "express";

const router = express.Router();

let voiceConfig = {
  voiceModel: "alloy",
  autoReply: false,
};

router.get("/voice-config", (req, res) => {
  res.json(voiceConfig);
});

router.post("/voice-config", (req, res) => {
  voiceConfig = { ...voiceConfig, ...req.body };
  res.json({ ok: true });
});

export default router;
