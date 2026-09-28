const express = require("express");
const router = express.Router();

// Only Jon & Alison can access the Owner Dashboard
const OWNERS = [
  "jondenham85@gmail.com",
  "allydenham013@gmail.com"
];

// Madison's internal loaders (replace with your real db/utils)
const db = require("../utils/db");
const operator = require("../operator/index");

// Load products
async function loadProducts() {
  return db.read("products") || [];
}

// Load revenue
async function loadRevenue() {
  return {
    total: db.read("revenue_total") || 0,
    history: db.read("revenue_history") || []
  };
}

// Load workflows
async function loadWorkflows() {
  return db.read("workflows") || [];
}

// Load system status
async function loadSystemStatus() {
  return {
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    status: "online"
  };
}

// Load operator engine status
async function loadEngineStatus() {
  return {
    engine: "Madison Operator Engine",
    version: "1.0.0",
    status: "ready"
  };
}

// OWNER DASHBOARD ROUTE
router.post("/", async (req, res) => {
  const { email } = req.body;

  // Reject everyone except Jon & Alison
  if (!email || !OWNERS.includes(email)) {
    return res.status(403).json({ error: "Access denied" });
  }

  // Load all owner-only data
  const [products, revenue, workflows, system, engine] = await Promise.all([
    loadProducts(),
    loadRevenue(),
    loadWorkflows(),
    loadSystemStatus(),
    loadEngineStatus()
  ]);

  res.json({
    status: "owner-access-granted",
    owner: email,
    dashboard: {
      products,
      revenue,
      workflows,
      system,
      engine
    }
  });
});

module.exports = router;
