"use client";

import { useEffect, useState } from "react";

const BACKEND_URL = "https://madison-backend-7lvr.onrender.com";

type ChatLog = {
  id: string;
  user: string;
  prompt: string;
  reply: string;
  timestamp: string;
};

export default function ChatIntelligenceAdmin() {
  const [logs, setLogs] = useState<ChatLog[]>([]);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [savingPrompt, setSavingPrompt] = useState(false);
  const [clearingLogs, setClearingLogs] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConfig();
    loadLogs();
  }, []);

  const loadConfig = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/chat-config`);
      if (!res.ok) throw new Error("Config load failed");
      const data = await res.json();
      setSystemPrompt(data.systemPrompt ?? "");
    } catch (err: any) {
      setError("Failed to load chat config.");
    }
  };

  const loadLogs = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/chat-logs`);
      if (!res.ok) throw new Error("Logs load failed");
      const data = await res.json();
      setLogs(data.logs ?? []);
    } catch (err: any) {
      setError("Failed to load chat logs.");
    }
  };

  const savePrompt = async () => {
    setSavingPrompt(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/admin/chat-config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemPrompt }),
      });
      if (!res.ok) throw new Error("Save failed");
    } catch (err: any) {
      setError("Failed to save system prompt.");
    } finally {
      setSavingPrompt(false);
    }
  };

  const clearLogs = async () => {
    setClearingLogs(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/admin/chat-logs/clear`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Clear failed");
      setLogs([]);
    } catch (err: any) {
      setError("Failed to clear logs.");
    } finally {
      setClearingLogs(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #00e6e6 0%, #000000 55%, #000000 100%)",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "32px 16px 80px",
        position: "relative",
        zIndex: 1,
      }}
    >
      <section
        style={{
          maxWidth: "900px",
          width: "100%",
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "8px",
          }}
        >
          MAD MADISON CHAT INTELLIGENCE
        </h1>
        <p style={{ fontSize: "14px", opacity: 0.85 }}>
          Owner‑level controls for GPT‑4o chat behavior, memory, and logs.
        </p>
      </section>

      <section
        style={{
          maxWidth: "900px",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1.1fr 1.4fr",
          gap: "20px",
        }}
      >
        {/* System Prompt Editor */}
        <div
          style={{
            padding: "16px",
            borderRadius: "18px",
            border: "1px solid rgba(0, 230, 230, 0.5)",
            boxShadow: "0 0 20px rgba(0, 230, 230, 0.7)",
            background:
              "radial-gradient(circle at top, #001b1f 0%, #000000 55%)",
          }}
        >
          <h2
            style={{
              fontSize: "16px",
              fontWeight: 700,
              marginBottom: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            System Prompt
          </h2>
          <p
            style={{
              fontSize: "13px",
              opacity: 0.8,
              marginBottom: "10px",
            }}
          >
            This defines how MAD Madison behaves in chat—tone, role, and rules.
          </p>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={10}
            style={{
              width: "100%",
              borderRadius: "12px",
              border: "1px solid rgba(0, 230, 230, 0.6)",
              background: "#000000",
              color: "#ffffff",
              padding: "10px",
              fontSize: "13px",
              resize: "vertical",
              boxShadow: "0 0 12px rgba(0, 230, 230, 0.6)",
            }}
          />
          <button
            onClick={savePrompt}
            disabled={savingPrompt}
            style={{
              marginTop: "12px",
              padding: "10px 16px",
              borderRadius: "12px",
              border: "1px solid rgba(0, 230, 230, 0.9)",
              background:
                "linear-gradient(135deg, #0bbcc9 0%, #00e6e6 40%, #004b4f 100%)",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              cursor: savingPrompt ? "default" : "pointer",
              boxShadow: "0 0 16px rgba(0, 230, 230, 0.9)",
              opacity: savingPrompt ? 0.7 : 1,
            }}
          >
            {savingPrompt ? "Saving…" : "Save Prompt"}
          </button>
        </div>

        {/* Chat Logs */}
        <div
          style={{
            padding: "16px",
            borderRadius: "18px",
            border: "1px solid rgba(0, 230, 230, 0.5)",
            boxShadow: "0 0 20px rgba(0, 230, 230, 0.7)",
            background:
              "radial-gradient(circle at top, #001b1f 0%, #000000 55%)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Chat Logs
            </h2>
            <button
              onClick={clearLogs}
              disabled={clearingLogs}
              style={{
                padding: "6px 10px",
                borderRadius: "10px",
                border: "1px solid rgba(255, 128, 128, 0.9)",
                background:
                  "linear-gradient(135deg, #ff4f4f 0%, #7a0000 60%, #000000 100%)",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                cursor: clearingLogs ? "default" : "pointer",
                boxShadow: "0 0 14px rgba(255, 80, 80, 0.9)",
                opacity: clearingLogs ? 0.7 : 1,
              }}
            >
              {clearingLogs ? "Clearing…" : "Clear Logs"}
            </button>
          </div>

          <div
            style={{
              fontSize: "12px",
              opacity: 0.8,
              marginBottom: "8px",
            }}
          >
            Recent conversations with MAD Madison. For owner review only.
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              marginTop: "8px",
              borderRadius: "12px",
              border: "1px solid rgba(0, 230, 230, 0.4)",
              padding: "10px",
              maxHeight: "360px",
            }}
          >
            {logs.length === 0 && (
              <div style={{ fontSize: "12px", opacity: 0.7 }}>
                No logs yet. Once users chat, they’ll appear here.
              </div>
            )}

            {logs.map((log) => (
              <div
                key={log.id}
                style={{
                  marginBottom: "10px",
                  paddingBottom: "8px",
                  borderBottom: "1px solid rgba(0, 230, 230, 0.2)",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    opacity: 0.7,
                    marginBottom: "4px",
                  }}
                >
                  {log.timestamp} · {log.user}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    marginBottom: "4px",
                    color: "#00e6e6",
                  }}
                >
                  Q: {log.prompt}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    opacity: 0.9,
                  }}
                >
                  A: {log.reply}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {error && (
        <p
          style={{
            marginTop: "16px",
            color: "#ff8080",
            fontSize: "13px",
          }}
        >
          {error}
        </p>
      )}
    </main>
  );
}
