const tierMode = require('./modes/tier');
const productMode = require('./modes/product');
const revenueMode = require('./modes/revenue');
const workflowMode = require('./modes/workflow');
const ceoMode = require('./modes/ceo');

async function route(payload) {
  const { mode = 'tier' } = payload || {};

  switch (mode) {
    case 'tier':
      return tierMode.handle(payload);
    case 'product':
      return productMode.handle(payload);
    case 'revenue':
      return revenueMode.handle(payload);
    case 'workflow':
      return workflowMode.handle(payload);
    case 'ceo':
      return ceoMode.handle(payload);
    default:
      return { mode, message: 'Unknown mode', payload };
  }
}

module.exports = { route };
