const db = require("../utils/db");

module.exports = {
  getAll() {
    return db.get("products") || {};
  },

  add(name, price) {
    const products = db.get("products") || {};
    products[name] = {
      name,
      price,
      created: Date.now()
    };
    db.set("products", products);
    return products[name];
  },

  update(name, fields) {
    const products = db.get("products") || {};
    if (!products[name]) throw new Error(`Product '${name}' not found`);
    products[name] = { ...products[name], ...fields, updated: Date.now() };
    db.set("products", products);
    return products[name];
  },

  remove(name) {
    const products = db.get("products") || {};
    if (!products[name]) throw new Error(`Product '${name}' not found`);
    delete products[name];
    db.set("products", products);
    return true;
  }
};
