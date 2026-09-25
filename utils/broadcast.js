module.exports = function broadcast(type, data = {}) {
  global.broadcast({ type, ...data });
};
