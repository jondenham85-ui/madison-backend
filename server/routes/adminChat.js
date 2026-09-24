import express from "express";

const router = express.Router();

// In‑memory store for demo; you can swap to DB later
let systemPrompt = "You are MAD Madison, a unified AI operator.";
let chatLogs = [];

router.get("/chat-config", (req, res) => {
  res.json({ systemPrompt });
});

router.post("/chat-config", (req, res) => {
  const { systemPrompt: newPrompt } = req.body;
  if (typeof newPrompt !== "string") {
    return res.status(400).json({ error: "Invalid systemPrompt" });
  }
  systemPrompt = newPrompt;
  res.json({ ok: true });
});

router.get("/chat-logs", (req, res) => {
  res.json({ logs: chatLogs });
});

router.post("/chat-logs/clear", (req, res) => {
  chatLogs = [];
  res.json({ ok: true });
});

// Helper to be called from chat route to record logs
export function recordChatLog({ user = "anonymous", prompt, reply }) {
  chatLogs.push({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    user,
    prompt,
    reply,
    timestamp: new Date().toISOString(),
  });
  if (chatLogs.length > 200) {
    chatLogs = chatLogs.slice(-200);
  }
}

export function getSystemPrompt() {
  return systemPrompt;
}

export default router;
