// Workflow Engine – Madison CEO Mode

const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "db", "workflows.json");

function load() {
  if (!fs.existsSync(DB_PATH)) return {};
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

function save(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

module.exports = {
  getAll() {
    return load();
  },

  add(name, steps = []) {
    const db = load();
    db[name] = {
      name,
      steps,
      created: Date.now(),
      status: "ready"
    };
    save(db);
    return db[name];
  },

  updateStatus(name, status) {
    const db = load();
    if (!db[name]) throw new Error(`Workflow '${name}' not found`);
    db[name].status = status;
    db[name].updated = Date.now();
    save(db);
    return db[name];
  }
};
