function analyzeWorkflows(input) {
  const { workflows = [] } = input || {};
  const count = workflows.length;
  const automated = workflows.filter(w => w && w.automated).length;

  return {
    count,
    automated,
    manual: count - automated
  };
}

module.exports = { analyzeWorkflows };
