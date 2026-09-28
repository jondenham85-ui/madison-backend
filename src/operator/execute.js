// src/operator/execute.js

module.exports = {
  run: async (code) => {
    try {
      const result = eval(code);
      return {
        ok: true,
        executed: code,
        result
      };
    } catch (err) {
      return {
        ok: false,
        error: err.toString()
      };
    }
  }
};
