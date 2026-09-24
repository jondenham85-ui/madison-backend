import { OPENAI_API_KEY, OPENAI_URL } from "../config.js";
import logger from "./logger.js";

export async function aiChat(messages) {
  try {
    const res = await fetch(`${OPENAI_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages,
      }),
    });

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "No reply.";
  } catch (err) {
    logger("AI Chat Error: " + err.message);
    return "MAD Madison backend error.";
  }
}

export async function aiVoice(text) {
  try {
    const res = await fetch(`${OPENAI_URL}/audio/speech`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        voice: "alloy",
        input: text,
      }),
    });

    return Buffer.from(await res.arrayBuffer());
  } catch (err) {
    logger("AI Voice Error: " + err.message);
    return null;
  }
}

export async function aiTranscribe(audioBuffer) {
  try {
    const form = new FormData();
    form.append("file", new Blob([audioBuffer]), "audio.webm");
    form.append("model", "gpt-4o-mini-tts");

    const res = await fetch(`${OPENAI_URL}/audio/transcriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: form,
    });

    const data = await res.json();
    return data.text || "";
  } catch (err) {
    logger("AI Transcription Error: " + err.message);
    return "";
  }
}
