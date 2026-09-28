// engines/workflow.js
const workflowEngine = require("./workflowEngine");

module.exports = {
  getAll: () => {
    if (typeof workflowEngine.getAll === "function") {
      return workflowEngine.getAll();
    }
    return [
      { id: 1, name: "default-workflow", status: "active" }
    ];
  },

  runWorkflow: (payload) => {
    if (typeof workflowEngine.runWorkflow === "function") {
      return workflowEngine.runWorkflow(payload);
    }
    return {
      ok: true,
      workflow: "default",
      received: payload,
      processedAt: new Date().toISOString()
    };
  }
};
