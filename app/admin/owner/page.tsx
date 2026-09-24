"use client";

import { useEffect, useState } from "react";

const BACKEND_URL = "https://madison-backend-7lvr.onrender.com";

export default function OwnerControls() {
  const [status, setStatus] = useState<any>(null);

  const reboot = async () => {
    await fetch(`${BACKEND_URL}/admin/reboot`, { method: "POST" });
    setStatus("System reboot triggered.");
  };

  return (
    <main style={{ padding: 32, color: "#fff" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Owner Controls</h1>

      <button onClick={reboot}>Reboot Backend</button>

      {status && <p style={{ marginTop: 20 }}>{status}</p>}
    </main>
  );
}
