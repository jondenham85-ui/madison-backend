"use client";

import { useEffect, useRef, useState } from "react";

const BACKEND_URL = "https://madison-backend-7lvr.onrender.com";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Welcome to MAD Madison chat. Ask anything—systems, automation, ideas, or next steps.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!res.ok) {
        throw new Error(`Backend error: ${res.status}`);
      }

      const data = await res.json();
      const reply: ChatMessage = {
        role: "assistant",
        content: data.reply ?? "No response received.",
      };

      setMessages((prev) => [...prev, reply]);
    } catch (err: any) {
      console.error(err);
      setError("MAD Madison backend is unavailable. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
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
        padding: "24px 12px 80px",
        position: "relative",
        zIndex: 1,
      }}
    >
      <section
        style={{
          maxWidth: "720px",
          width: "100%",
          textAlign: "center",
          marginBottom: "16px",
        }}
      >
        <h1
          style={{
            fontSize: "26px",
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "8px",
          }}
        >
          MAD MADISON CHAT
        </h1>
        <p
          style={{
            fontSize: "14px",
            opacity: 0.85,
          }}
        >
          Backend‑powered GPT‑4o chat via MAD Madison backend on Render.
        </p>
      </section>

      <section
        style={{
          maxWidth: "720px",
          width: "100%",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
            borderRadius: "16px",
            border: "1px solid rgba(0, 230, 230, 0.4)",
            boxShadow: "0 0 18px rgba(0, 230, 230, 0.6)",
            background:
              "radial-gradient(circle at top, #001b1f 0%, #000000 55%)",
          }}
        >
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: "12px",
                display: "flex",
                justifyContent:
                  m.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  padding: "10px 14px",
                  borderRadius: "14px",
                  fontSize: "14px",
                  lineHeight: 1.4,
                  background:
                    m.role === "user"
                      ? "linear-gradient(135deg, #0bbcc9 0%, #00e6e6 40%, #004b4f 100%)"
                      : "radial-gradient(circle at top, #001b1f 0%, #000000 55%)",
                  border:
                    m.role === "user"
                      ? "1px solid rgba(0, 230, 230, 0.9)"
                      : "1px solid rgba(0, 230, 230, 0.4)",
                  boxShadow:
                    m.role === "user"
                      ? "0 0 18px rgba(0, 230, 230, 0.9)"
                      : "0 0 12px rgba(0, 230, 230, 0.5)",
                }}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div
              style={{
                marginTop: "8px",
                fontSize: "13px",
                opacity: 0.8,
              }}
            >
              MAD Madison is thinking…
            </div>
          )}

          {error && (
            <div
              style={{
                marginTop: "8px",
                fontSize: "13px",
                color: "#ff8080",
              }}
            >
              {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "8px",
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask MAD Madison anything…"
            style={{
              flex: 1,
              padding: "12px 14px",
              borderRadius: "14px",
              border: "1px solid rgba(0, 230, 230, 0.6)",
              background: "#000000",
              color: "#ffffff",
              fontSize: "14px",
              outline: "none",
              boxShadow: "0 0 12px rgba(0, 230, 230, 0.6)",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            style={{
              padding: "12px 18px",
              borderRadius: "14px",
              border: "1px solid rgba(0, 230, 230, 0.9)",
              background:
                "linear-gradient(135deg, #0bbcc9 0%, #00e6e6 40%, #004b4f 100%)",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              cursor: loading ? "default" : "pointer",
              boxShadow: "0 0 18px rgba(0, 230, 230, 0.9)",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Thinking…" : "Send"}
          </button>
        </div>
      </section>
    </main>
  );
}
