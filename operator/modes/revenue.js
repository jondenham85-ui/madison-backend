const revenueEngine = require('../../engines/revenueEngine');

async function handle(payload) {
  const result = revenueEngine.analyzeRevenue(payload.data || {});
  return { mode: 'revenue', result };
}

module.exports = { handle };
