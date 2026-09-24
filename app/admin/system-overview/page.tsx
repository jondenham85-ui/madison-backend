"use client";

import { useEffect, useState } from "react";

const BACKEND_URL = "https://madison-backend-7lvr.onrender.com";

export default function SystemOverview() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/system`);
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError("Failed to load system overview.");
    }
  };

  return (
    <main style={{ padding: 32, color: "#fff" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>System Overview</h1>

      {error && <p style={{ color: "#ff8080" }}>{error}</p>}

      {!data && !error && <p>Loading…</p>}

      {data && (
        <div
          style={{
            marginTop: 20,
            padding: 20,
            borderRadius: 16,
            border: "1px solid rgba(0,230,230,0.5)",
            boxShadow: "0 0 20px rgba(0,230,230,0.7)",
          }}
        >
          <p>Backend Status: {data.backend}</p>
          <p>Chat Engine: {data.chat}</p>
          <p>Voice Engine: {data.voice}</p>
          <p>Model: {data.model}</p>
          <p>Version: {data.version}</p>
          <p>Uptime: {data.uptime}</p>
        </div>
      )}
    </main>
  );
}
