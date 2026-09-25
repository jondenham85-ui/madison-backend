// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { WebSocketServer } = require("ws");
const { OpenAI } = require("openai");
const { PrismaClient, MemoryType } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// ====== CONFIG ======
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "owner@madmadisonai.com";
const ADMIN_PASSWORD_PLAIN = process.env.ADMIN_PASSWORD || "ChangeThisPassword";

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// ====== MIDDLEWARE ======
app.use(cors());
app.use(express.json());

// ====== INIT ADMIN USER ======
async function initAdmin() {
  const existing = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
  if (!existing) {
    const hash = await bcrypt.hash(ADMIN_PASSWORD_PLAIN, 10);
    await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        password: hash,
        role: "admin"
      }
    });
    console.log("Admin user initialized");
  } else {
    console.log("Admin user exists");
  }

  const settingsCount = await prisma.setting.count();
  if (settingsCount === 0) {
    await prisma.setting.create({
      data: {
        siteName: "MadMadisonAI",
        ownerEmail: ADMIN_EMAIL,
        supportEmail: ADMIN_EMAIL
      }
    });
    console.log("Default settings initialized");
  }
}

initAdmin().catch(console.error);

// ====== AUTH HELPERS ======
function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Missing Authorization header" });

  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// ====== ROUTES ======

// Health
app.get("/", (req, res) => {
  res.json({ status: "ok", app: "madison-backend" });
});

// ---- CHAT ----
app.post("/chat", async (req, res) => {
  try {
    const { message, context } = req.body;
    if (!message) return res.status(400).json({ error: "Missing 'message'" });
    if (!OPENAI_API_KEY) return res.status(500).json({ error: "OPENAI_API_KEY not set" });

    const memories = await prisma.memory.findMany({
      where: { OR: [{ type: MemoryType.BUSINESS }, { type: MemoryType.PERSONAL }] },
      orderBy: { createdAt: "desc" },
      take: 10
    });

    const memoryText = memories.map(m => `- (${m.type}) ${m.content}`).join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Madison, an AI operator for MadMadisonAI. You help with business, automation, and personal operations. Use memory when relevant."
        },
        {
          role: "system",
          content: `Recent memory:\n${memoryText || "No memory yet."}`
        },
        { role: "user", content: message }
      ]
    });

    const reply = completion.choices[0]?.message?.content || "No response generated.";

    await prisma.memory.create({
      data: {
        type: MemoryType.CHAT,
        owner: req.user?.email || "anonymous",
        content: `User: ${message}\nMadison: ${reply}`
      }
    });

    res.json({ reply });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Chat failed" });
  }
});

// ---- ADMIN LOGIN ----
app.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = createToken({ email: user.email, role: user.role });
    res.json({ token });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// ---- PRODUCTS ----
app.get("/admin/products", authMiddleware, async (req, res) => {
  const products = await prisma.product.findMany();
  res.json({ products });
});

app.post("/admin/products", authMiddleware, async (req, res) => {
  const { name, price, active } = req.body;
  if (!name || price == null) return res.status(400).json({ error: "Name and price required" });

  const product = await prisma.product.create({
    data: { name, price, active: active ?? true }
  });
  res.json({ product });
});

app.put("/admin/products/:id", authMiddleware, async (req, res) => {
  const id = Number(req.params.id);
  const { name, price, active } = req.body;

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      price,
      active
    }
  });
  res.json({ product });
});

app.delete("/admin/products/:id", authMiddleware, async (req, res) => {
  const id = Number(req.params.id);
  const removed = await prisma.product.delete({ where: { id } });
  res.json({ removed });
});

// ---- SETTINGS ----
app.get("/admin/settings", authMiddleware, async (req, res) => {
  const settings = await prisma.setting.findFirst();
  res.json({ settings });
});

app.put("/admin/settings", authMiddleware, async (req, res) => {
  const { siteName, ownerEmail, supportEmail } = req.body;
  const settings = await prisma.setting.findFirst();

  const updated = await prisma.setting.update({
    where: { id: settings.id },
    data: {
      siteName: siteName ?? settings.siteName,
      ownerEmail: ownerEmail ?? settings.ownerEmail,
      supportEmail: supportEmail ?? settings.supportEmail
    }
  });

  res.json({ settings: updated });
});

// ---- AUTOMATION TEMPLATES ----
app.get("/automation/templates", authMiddleware, async (req, res) => {
  const templates = await prisma.automationTemplate.findMany();
  res.json({ templates });
});

// ---- AUTOMATION JOBS ----
app.get("/automation/jobs", authMiddleware, async (req, res) => {
  const jobs = await prisma.automationJob.findMany({ include: { template: true } });
  res.json({ jobs });
});

app.get("/automation/jobs/:id", authMiddleware, async (req, res) => {
  const id = Number(req.params.id);
  const job = await prisma.automationJob.findUnique({ where: { id }, include: { template: true } });
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json({ job });
});

// ---- AUTOMATION RUN ----
app.post("/automation/run", authMiddleware, async (req, res) => {
  try {
    const { templateId, input } = req.body;
    if (!templateId) return res.status(400).json({ error: "templateId required" });

    const template = await prisma.automationTemplate.findUnique({ where: { id: Number(templateId) } });
    if (!template) return res.status(404).json({ error: "Template not found" });

    const job = await prisma.automationJob.create({
      data: {
        templateId: template.id,
        status: "queued",
        inputJson: JSON.stringify(input || {})
      }
    });

    let prompt;
    switch (template.type) {
      case "report":
        prompt = `
You are Madison, an AI operator for MadMadisonAI.

Generate a clear, actionable business summary based on this context:

${JSON.stringify(input || {}, null, 2)}
        `;
        break;
      case "followup":
        prompt = `
You are Madison, an AI operator for MadMadisonAI.

Generate follow-up messages for leads based on this data:

${JSON.stringify(input || {}, null, 2)}
        `;
        break;
      case "content":
        prompt = `
You are Madison, an AI operator for MadMadisonAI.

Generate a batch of content:
- 5 social posts
- 3 email subject lines
- 2 email bodies

Context:

${JSON.stringify(input || {}, null, 2)}
        `;
        break;
      default:
        prompt = `
You are Madison, an AI operator for MadMadisonAI.

Run an automation task with this context:

${JSON.stringify(input || {}, null, 2)}
        `;
    }

    let resultJson;
    let status = "completed";

    if (!OPENAI_API_KEY) {
      status = "failed";
      resultJson = JSON.stringify({ error: "OPENAI_API_KEY not set" });
    } else {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are Madison, an AI automation engine for businesses." },
          { role: "user", content: prompt }
        ]
      });

      const text = completion.choices[0]?.message?.content || "No automation result generated.";
      resultJson = JSON.stringify({ output: text });
    }

    const updatedJob = await prisma.automationJob.update({
      where: { id: job.id },
      data: {
        status,
        resultJson,
        startedAt: new Date(),
        finishedAt: new Date()
      }
    });

    res.json({ job: updatedJob });
  } catch (err) {
    console.error("Automation run error:", err);
    res.status(500).json({ error: "Automation run failed" });
  }
});

// ---- LEADS ----
app.get("/leads", authMiddleware, async (req, res) => {
  const leads = await prisma.lead.findMany();
  res.json({ leads });
});

app.post("/leads", authMiddleware, async (req, res) => {
  const { name, email, status, notes } = req.body;
  const lead = await prisma.lead.create({
    data: { name, email, status: status || "new", notes }
  });
  res.json({ lead });
});

// ---- CUSTOMERS ----
app.get("/customers", authMiddleware, async (req, res) => {
  const customers = await prisma.customer.findMany();
  res.json({ customers });
});

app.post("/customers", authMiddleware, async (req, res) => {
  const { name, email, notes } = req.body;
  const customer = await prisma.customer.create({
    data: { name, email, notes }
  });
  res.json({ customer });
});

// ---- REVENUE ----
app.get("/revenue", authMiddleware, async (req, res) => {
  const revenue = await prisma.revenue.findMany();
  res.json({ revenue });
});

app.post("/revenue", authMiddleware, async (req, res) => {
  const { amount, source, note } = req.body;
  const entry = await prisma.revenue.create({
    data: { amount, source, note }
  });
  res.json({ entry });
});

// ---- MEMORY ----
app.get("/memory", authMiddleware, async (req, res) => {
  const memories = await prisma.memory.findMany({
    orderBy: { createdAt: "desc" },
    take: 50
  });
  res.json({ memories });
});

app.post("/memory", authMiddleware, async (req, res) => {
  const { type, content, owner } = req.body;
  if (!type || !content) return res.status(400).json({ error: "type and content required" });

  const memory = await prisma.memory.create({
    data: {
      type,
      content,
      owner: owner || req.user?.email || "system"
    }
  });
  res.json({ memory });
});

// ---- VOICE (stub) ----
app.post("/voice", authMiddleware, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text required" });

  await prisma.memory.create({
    data: {
      type: MemoryType.VOICE,
      owner: req.user?.email || "anonymous",
      content: text
    }
  });

  res.json({ spoken: text });
});

// ====== SERVER + WEBSOCKETS ======
const server = app.listen(PORT, () => {
  console.log(`Madison backend running on port ${PORT}`);
});

const wss = new WebSocketServer({ server });

wss.on("connection", ws => {
  console.log("WebSocket client connected");

  ws.on("message", msg => {
    console.log("WS message:", msg.toString());
    ws.send(`Echo from Madison: ${msg.toString()}`);
  });

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
  });
});
