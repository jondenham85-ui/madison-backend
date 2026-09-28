// src/operator/file.js
const fs = require("fs");
const path = require("path");

function resolve(p) {
  return path.join(process.cwd(), p);
}

module.exports = {
  read: async (p) => {
    try {
      const full = resolve(p);
      const data = fs.readFileSync(full, "utf8");
      return { ok: true, path: p, data };
    } catch (err) {
      return { ok: false, error: err.toString() };
    }
  },

  write: async (p, content) => {
    try {
      const full = resolve(p);
      fs.writeFileSync(full, content, "utf8");
      return { ok: true, path: p, written: content.length };
    } catch (err) {
      return { ok: false, error: err.toString() };
    }
  },

  patch: async (p, patch) => {
    try {
      const full = resolve(p);
      let data = fs.readFileSync(full, "utf8");

      const updated = data.replace(patch.target, patch.replace);
      fs.writeFileSync(full, updated, "utf8");

      return {
        ok: true,
        path: p,
        patch
      };
    } catch (err) {
      return { ok: false, error: err.toString() };
    }
  }
};
