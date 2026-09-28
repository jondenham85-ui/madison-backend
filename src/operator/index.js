// Madison Operator Engine – CEO Mode Router

const tasks = require("./task");

module.exports = {
  async runTask(message) {
    const lower = message.toLowerCase();

    // ADD PRODUCT
    if (lower.startsWith("add product")) {
      const [, name, price] = message.split("::");
      return tasks.addProduct(name.trim(), price.trim());
    }

    // ADD REVENUE
    if (lower.startsWith("add revenue")) {
      const [, amount, source] = message.split("::");
      return tasks.addRevenue(amount.trim(), source.trim());
    }

    // ADD WORKFLOW
    if (lower.startsWith("add workflow")) {
      const [, name] = message.split("::");
      return tasks.addWorkflow(name.trim());
    }

    // SET TIER
    if (lower.startsWith("set tier")) {
      const [, email, level] = message.split("::");
      return tasks.setTier(email.trim(), level.trim());
    }

    // AUDIT SYSTEM
    if (lower.includes("audit system")) {
      return tasks.auditSystem();
    }

    // DEPLOY SYSTEM
    if (lower.includes("deploy system")) {
      return tasks.deploySystem();
    }

    return `Task '${message}' not recognized as CEO Mode command.`;
  }
};
