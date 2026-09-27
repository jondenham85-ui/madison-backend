module.exports = {
  runTask: require("./task"),
  executeCode: require("./execute"),
  readFile: require("./file").read,
  writeFile: require("./file").write,
  patchFile: require("./file").patch,
  deploy: require("./deploy")
};
