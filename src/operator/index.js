// Madison Operator Engine – Main Router

const task = require("./task");
const execute = require("./execute");
const file = require("./file");
const deploy = require("./deploy");

module.exports = {
  async runTask(message) {
    const lower = message.toLowerCase();

    // CEO MODE COMMANDS
    if (lower.startsWith("add product")) {
      const [, name, price] = message.split("::");
      return task.addProduct(name.trim(), Number(price.trim()));
    }

    if (lower.startsWith("add revenue")) {
      const [, amount, source] = message.split("::");
      return task.addRevenue(Number(amount.trim()), source.trim());
    }

    if (lower.startsWith("add workflow")) {
      const [, name] = message.split("::");
      return task.addWorkflow(name.trim());
    }

    if (lower.startsWith("set tier")) {
      const [, email, tier] = message.split("::");
      return task.setTier(email.trim(), tier.trim());
    }

    if (lower.includes("audit system")) {
      return task.auditSystem();
    }

    if (lower.includes("deploy system")) {
      return task.deploySystem();
    }

    // FALLBACK TO EXISTING OPERATOR LOGIC
    return `Task '${message}' not recognized as CEO Mode command.`;
  },

  executeCode: execute.executeCode,
  readFile: file.readFile,
  writeFile: file.writeFile,
  patchFile: file.patchFile,
  deploy: deploy.deploy
};
