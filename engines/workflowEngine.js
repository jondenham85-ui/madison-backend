// engines/workflowEngine.js

module.exports = {
  getAll: () => {
    return [
      { id: 1, name: "default-workflow", status: "active" }
    ];
  },

  runWorkflow: (payload) => {
    return {
      ok: true,
      workflow: "default",
      received: payload,
      processedAt: new Date().toISOString()
    };
  }
};
