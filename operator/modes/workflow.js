const workflowEngine = require('../../engines/workflowEngine');

async function handle(payload) {
  const result = workflowEngine.analyzeWorkflows(payload.data || {});
  return { mode: 'workflow', result };
}

module.exports = { handle };
