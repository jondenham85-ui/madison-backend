const router = require('./router');

module.exports = {
  runTask: async (payload) => {
    return router.route(payload);
  }
};
