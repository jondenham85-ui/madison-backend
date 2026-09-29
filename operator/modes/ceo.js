const tierEngine = require('../../engines/tierEngine');
const productEngine = require('../../engines/productEngine');
const revenueEngine = require('../../engines/revenueEngine');
const workflowEngine = require('../../engines/workflowEngine');

async function handle(payload) {
  const data = payload.data || {};

  const tier = tierEngine.evaluate(data);
  const products = productEngine.analyzeProducts(data);
  const revenue = revenueEngine.analyzeRevenue(data);
  const workflows = workflowEngine.analyzeWorkflows(data);

  return {
    mode: 'ceo',
    tier,
    products,
    revenue,
    workflows
  };
}

module.exports = { handle };
