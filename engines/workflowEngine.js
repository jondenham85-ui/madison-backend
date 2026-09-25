const db = require("../utils/db");

module.exports = {
  runWorkflow(name, payload) {
    const workflows = db.read("workflows");

    const entry = {
      name,
      payload,
      timestamp: Date.now(),
      status: "completed"
    };

    workflows.push(entry);
    db.write("workflows", workflows);

    global.broadcast({
      type: "automation:run",
      workflow: name
    });

    return entry;
  }
};
