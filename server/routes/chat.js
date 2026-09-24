import express from "express";
import { aiChat } from "../utils/ai.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages) {
      return res.status(400).json({ error: "Missing messages array" });
    }

    const reply = await aiChat(messages);

    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: "Chat route error" });
  }
});

export default router;
