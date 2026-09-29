const tierEngine = require('../../engines/tierEngine');

async function handle(payload) {
  const result = tierEngine.evaluate(payload.data || {});
  return { mode: 'tier', result };
}

module.exports = { handle };
