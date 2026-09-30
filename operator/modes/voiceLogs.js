import db from "../../db/client.js";

export default async function voiceLogs({ logs, timestamp }) {
  if (!logs || logs.length === 0) {
    return { ok: true };
  }

  for (const turn of logs) {
    await db.query(
      `
      INSERT INTO voice_logs (speaker, user_text, madison_text, emotion, history)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [
        turn.speaker,
        turn.text,
        turn.madison || "",
        turn.emotion || "neutral",
        JSON.stringify(logs)
      ]
    );
  }

  return { ok: true };
}
