"use client";

import { useEffect, useState } from "react";

const BACKEND_URL = "https://madison-backend-7lvr.onrender.com";

export default function Revenue() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await fetch(`${BACKEND_URL}/admin/revenue`);
    const json = await res.json();
    setData(json);
  };

  if (!data) return <p>Loading…</p>;

  return (
    <main style={{ padding: 32, color: "#fff" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Revenue & Billing</h1>

      <p>Total Revenue: ${data.total}</p>
      <p>Subscriptions: {data.subscriptions}</p>
      <p>Refunds: {data.refunds}</p>
    </main>
  );
}
