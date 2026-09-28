// Product Engine – Madison CEO Mode

const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "db", "products.json");

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

  add(name, price) {
    const db = load();
    db[name] = { name, price, created: Date.now() };
    save(db);
    return db[name];
  },

  update(name, fields) {
    const db = load();
    if (!db[name]) throw new Error(`Product '${name}' not found`);
    db[name] = { ...db[name], ...fields, updated: Date.now() };
    save(db);
    return db[name];
  },

  remove(name) {
    const db = load();
    if (!db[name]) throw new Error(`Product '${name}' not found`);
    delete db[name];
    save(db);
    return true;
  }
};
