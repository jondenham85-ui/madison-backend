const router = require('./router');

async function handle(payload) {
  return router.route(payload);
}

module.exports = { handle };

