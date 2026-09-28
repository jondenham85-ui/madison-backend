// CEO MODE TASK ENGINE
// Madison Operator Engine – Task Layer

const fs = require("fs");
const path = require("path");

// Simple JSON DB helper
function loadDB(file) {
  const p = path.join(__dirname, "..", "..", "db", file);
  if (!fs.existsSync(p)) return {};
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function saveDB(file, data) {
  const p = path.join(__dirname, "..", "..", "db", file);
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}

// CEO MODE TASKS
module.exports = {
  async addProduct(name, price) {
    const db = loadDB("products.json");
    db[name] = { name, price, created: Date.now() };
    saveDB("products.json", db);
    return `Product '${name}' added.`;
  },

  async addRevenue(amount, source) {
    const db = loadDB("revenue.json");

    db.total = (db.total || 0) + amount;
    db.history = db.history || [];
    db.history.push({
      amount,
      source,
      time: Date.now()
    });

    saveDB("revenue.json", db);
    return `Revenue +$${amount} logged from ${source}.`;
  },

  async addWorkflow(name, steps = []) {
    const db = loadDB("workflows.json");

    db[name] = {
      name,
      steps,
      created: Date.now(),
      status: "ready"
    };

    saveDB("workflows.json", db);
    return `Workflow '${name}' created.`;
  },

  async setTier(email, tier) {
    const db = loadDB("users.json");

    db[email] = {
      email,
      tier,
      updated: Date.now()
    };

    saveDB("users.json", db);
    return `Tier for ${email} set to ${tier}.`;
  },

  async auditSystem() {
    return {
      status: "ok",
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      engines: {
        product: fs.existsSync(path.join(__dirname, "..", "engines", "product.js")),
        revenue: fs.existsSync(path.join(__dirname, "..", "engines", "revenue.js")),
        workflow: fs.existsSync(path.join(__dirname, "..", "engines", "workflow.js"))
      },
      db: {
        products: loadDB("products.json"),
        revenue: loadDB("revenue.json"),
        workflows: loadDB("workflows.json"),
        users: loadDB("users.json")
      }
    };
  },

  async deploySystem() {
    return "Deployment triggered (Render will auto‑redeploy on commit).";
  }
};
