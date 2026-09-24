"use client";

import { useEffect, useState } from "react";

const BACKEND_URL = "https://madison-backend-7lvr.onrender.com";

export default function VoiceControls() {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await fetch(`${BACKEND_URL}/admin/voice-config`);
    const json = await res.json();
    setConfig(json);
  };

  const update = async (field: string, value: any) => {
    await fetch(`${BACKEND_URL}/admin/voice-config`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    load();
  };

  if (!config) return <p>Loading…</p>;

  return (
    <main style={{ padding: 32, color: "#fff" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Voice Controls</h1>

      <div style={{ marginTop: 20 }}>
        <p>Voice Model: {config.voiceModel}</p>
        <button onClick={() => update("voiceModel", "alloy")}>Set Alloy</button>
        <button onClick={() => update("voiceModel", "verse")}>Set Verse</button>

        <p style={{ marginTop: 20 }}>Auto‑Reply: {config.autoReply ? "ON" : "OFF"}</p>
        <button onClick={() => update("autoReply", !config.autoReply)}>
          Toggle Auto‑Reply
        </button>
      </div>
    </main>
  );
}
