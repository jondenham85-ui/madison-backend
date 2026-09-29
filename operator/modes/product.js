const productEngine = require('../../engines/productEngine');

async function handle(payload) {
  const result = productEngine.analyzeProducts(payload.data || {});
  return { mode: 'product', result };
}

module.exports = { handle };
