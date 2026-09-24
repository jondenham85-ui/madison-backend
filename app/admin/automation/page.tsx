"use client";

import { useEffect, useState } from "react";

const BACKEND_URL = "https://madison-backend-7lvr.onrender.com";

export default function AutomationEngine() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [newJob, setNewJob] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await fetch(`${BACKEND_URL}/admin/jobs`);
    const json = await res.json();
    setJobs(json.jobs);
  };

  const addJob = async () => {
    await fetch(`${BACKEND_URL}/admin/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job: newJob }),
    });
    setNewJob("");
    load();
  };

  return (
    <main style={{ padding: 32, color: "#fff" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Automation Engine</h1>

      <input
        value={newJob}
        onChange={(e) => setNewJob(e.target.value)}
        placeholder="New automation job…"
      />
      <button onClick={addJob}>Add Job</button>

      <div style={{ marginTop: 20 }}>
        {jobs.map((j) => (
          <p key={j.id}>{j.text}</p>
        ))}
      </div>
    </main>
  );
}
