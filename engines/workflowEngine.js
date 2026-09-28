const db = require("../utils/db");

module.exports = {
  getAll() {
    return db.get("workflows") || {};
  },

  add(name, steps = []) {
    const workflows = db.get("workflows") || {};

    workflows[name] = {
      name,
      steps,
      created: Date.now(),
      status: "ready"
    };

    db.set("workflows", workflows);
    return workflows[name];
  },

  updateStatus(name, status) {
    const workflows = db.get("workflows") || {};
    if (!workflows[name]) throw new Error(`Workflow '${name}' not found`);

    workflows[name].status = status;
    workflows[name].updated = Date.now();

    db.set("workflows", workflows);
    return workflows[name];
  }
};
