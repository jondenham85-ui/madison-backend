const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Load operator engine
const operator = require("./src/operator");

// Load conversational Madison
const { madisonAI } = require("./src/ai/madison");

// OWNER LIST
const OWNERS = [
  "jondenham85@gmail.com",
  "allydenham013@gmail.com"
];

// ===============================
// OPERATOR MADISON (tasks)
// ===============================
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const lower = message.toLowerCase();
    let result;

    // EXECUTE CODE
    if (lower.startsWith("run ") || lower.includes("execute code")) {
      const code = message.replace(/^run /i, "");
      result = await operator.executeCode(code);
    }

    // READ FILE
    else if (lower.startsWith("read file")) {
      const path = message.replace(/read file/i, "").trim();
      result = await operator.readFile(path);
    }

    // WRITE FILE
    else if (lower.startsWith("write file")) {
      const parts = message.replace(/write file/i, "").trim().split("::");
      const path = parts[0]?.trim();
      const content = parts[1]?.trim() || "";
      result = await operator.writeFile(path, content);
    }

    // PATCH FILE
    else if (lower.startsWith("patch file")) {
      const parts = message.replace(/patch file/i, "").trim().split("::");
      const path = parts[0]?.trim();
      const patch = {
        target: parts[1]?.trim(),
        replace: parts[2]?.trim()
      };
      result = await operator.patchFile(path, patch);
    }

    // DEPLOY
    else if (lower.includes("deploy")) {
      result = await operator.deploy("full-system");
    }

    // DEFAULT: TASK ENGINE
    else {
      result = await operator.runTask(message);
    }

    res.json({ success: true, result });

  } catch (err) {
    console.error("AI Route Error:", err);
    res.status(500).json({
      success: false,
      error: err.toString()
    });
  }
});

// ===============================
// CONVERSATIONAL MADISON (chat)
// ===============================
app.post("/api/talk", async (req, res) => {
  try {
    const { message } = req.body;
    const reply = await madisonAI(message);
    res.json({ reply });
  } catch (err) {
    console.error("Talk error:", err);
    res.status(500).json({ error: "Chat failed" });
  }
});

// ===============================
// OWNER DASHBOARD (Jon + Alison)
// ===============================
app.post("/api/owner", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !OWNERS.includes(email)) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json({
      status: "owner-access-granted",
      owner: email,
      dashboard: {
        products: [],
        revenue: { total: 0, history: [] },
        workflows: [],
        system: { status: "online", uptime: process.uptime() },
        engine: { status: "ready", version: "1.0.0" }
      }
    });

  } catch (err) {
    console.error("Owner dashboard error:", err);
    res.status(500).json({ error: "Owner dashboard failed" });
  }
});

// ===============================
// HEALTH CHECK
// ===============================
app.get("/api/status", (req, res) => {
  res.json({ status: "Madison backend online" });
});

// ===============================
// PORT BINDING (Render)
// ===============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Madison backend running on port ${PORT}`);
});
