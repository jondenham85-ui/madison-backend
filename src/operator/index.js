// src/operator/index.js

const execute = require("./execute");
const file = require("./file");
const deploy = require("./deploy");
const task = require("./task");

module.exports = {
  executeCode: async (code) => {
    return execute.run(code);
  },

  readFile: async (path) => {
    return file.read(path);
  },

  writeFile: async (path, content) => {
    return file.write(path, content);
  },

  patchFile: async (path, patch) => {
    return file.patch(path, patch);
  },

  deploy: async (mode) => {
    return deploy.run(mode);
  },

  runTask: async (message) => {
    return task.run(message);
  }
};
