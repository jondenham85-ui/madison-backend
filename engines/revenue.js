// Revenue Engine – Madison CEO Mode

const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "db", "revenue.json");

function load() {
  if (!fs.existsSync(DB_PATH)) return { total: 0, history: [] };
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

function save(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

module.exports = {
  getSummary() {
    const db = load();
    return {
      total: db.total || 0,
      history: db.history || []
    };
  },

  add(amount, source) {
    const db = load();
    db.total = (db.total || 0) + amount;
    db.history = db.history || [];
    db.history.push({
      amount,
      source,
      time: Date.now()
    });
    save(db);
    return this.getSummary();
  }
};
