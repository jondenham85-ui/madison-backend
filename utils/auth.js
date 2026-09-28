// Auth / Tier Engine – Madison CEO Mode

const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "db", "users.json");

function load() {
  if (!fs.existsSync(DB_PATH)) return {};
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

function save(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

module.exports = {
  getTier(email) {
    const db = load();
    return db[email]?.tier || "public";
  },

  setTier(email, tier) {
    const db = load();
    db[email] = { email, tier, updated: Date.now() };
    save(db);
    return db[email];
  }
};
