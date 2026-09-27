const fs = require("fs");

module.exports = {
  read(path) {
    try {
      const content = fs.readFileSync(path, "utf8");
      return { success: true, content };
    } catch (err) {
      return { success: false, error: err.toString() };
    }
  },

  write(path, content) {
    try {
      fs.writeFileSync(path, content);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.toString() };
    }
  },

  patch(path, patch) {
    try {
      let content = fs.readFileSync(path, "utf8");
      content = content.replace(patch.target, patch.replace);
      fs.writeFileSync(path, content);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.toString() };
    }
  }
};
