import express from "express";
import { getAudioBuffer } from "../utils/audio.js";
import { aiTranscribe, aiChat, aiVoice } from "../utils/ai.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const audioBuffer = getAudioBuffer(req);
    if (!audioBuffer) {
      return res.status(400).json({ error: "Missing audio file" });
    }

    const text = await aiTranscribe(audioBuffer);

    const replyText = await aiChat([
      { role: "user", content: text }
    ]);

    const replyAudio = await aiVoice(replyText);

    res.setHeader("Content-Type", "audio/mp3");
    res.send(replyAudio);
  } catch (err) {
    res.status(500).json({ error: "Voice route error" });
  }
});

export default router;
