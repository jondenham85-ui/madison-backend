"use client";

import { useEffect, useRef, useState } from "react";

const BACKEND_URL = "https://madison-backend-7lvr.onrender.com";

export default function VoiceAssistant() {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [replyURL, setReplyURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      setError(null);
      setReplyURL(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        sendToBackend(audioBlob);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err: any) {
      console.error(err);
      setError("Microphone access failed.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const sendToBackend = async (audioBlob: Blob) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob);

      const res = await fetch(`${BACKEND_URL}/voice`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Backend error: ${res.status}`);
      }

      const arrayBuffer = await res.arrayBuffer();
      const replyBlob = new Blob([arrayBuffer], { type: "audio/mp3" });
      const replyUrl = URL.createObjectURL(replyBlob);

      setReplyURL(replyUrl);
    } catch (err: any) {
      console.error(err);
      setError("MAD Madison voice backend unavailable.");
    } finally {
      setLoading(false);
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
          maxWidth: "720px",
          textAlign: "center",
          marginBottom: "24px",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
        >
          MAD MADISON VOICE
        </h1>
        <p
          style={{
            fontSize: "15px",
            opacity: 0.85,
          }}
        >
          Speak to MAD Madison using the GPT‑4o voice pipeline.
        </p>
      </section>

      {/* Waveform */}
      <div
        style={{
          width: "260px",
          height: "60px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {recording ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              gap: "4px",
            }}
          >
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: "6px",
                  height: `${Math.random() * 60}px`,
                  background: "#00e6e6",
                  borderRadius: "4px",
                  animation: "madWave 0.4s infinite alternate",
                }}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              opacity: 0.4,
              fontSize: "14px",
            }}
          >
            Tap the mic to speak
          </div>
        )}
      </div>

      {/* Mic Button */}
      <button
        onClick={recording ? stopRecording : startRecording}
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background:
            recording
              ? "radial-gradient(circle, #ff4f4f 0%, #7a0000 70%)"
              : "radial-gradient(circle, #00e6e6 0%, #004b4f 70%)",
          border: "1px solid rgba(0, 230, 230, 0.9)",
          boxShadow: recording
            ? "0 0 28px rgba(255, 80, 80, 0.9)"
            : "0 0 28px rgba(0, 230, 230, 0.9)",
          color: "#ffffff",
          fontSize: "18px",
          fontWeight: 700,
          cursor: "pointer",
          marginBottom: "24px",
          animation: "madButtonPulse 2s infinite alternate",
        }}
      >
        {recording ? "Stop" : "Speak"}
      </button>

      {/* Playback */}
      {audioURL && (
        <div style={{ marginBottom: "16px", textAlign: "center" }}>
          <p style={{ opacity: 0.8 }}>Your recording:</p>
          <audio controls src={audioURL} />
        </div>
      )}

      {replyURL && (
        <div style={{ marginBottom: "16px", textAlign: "center" }}>
          <p style={{ opacity: 0.8 }}>MAD Madison reply:</p>
          <audio controls src={replyURL} />
        </div>
      )}

      {loading && (
        <p style={{ marginTop: "12px", opacity: 0.8 }}>
          Processing your voice…
        </p>
      )}

      {error && (
        <p style={{ marginTop: "12px", color: "#ff8080" }}>{error}</p>
      )}

      <style>{`
        @keyframes madWave {
          0% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>
    </main>
  );
}
