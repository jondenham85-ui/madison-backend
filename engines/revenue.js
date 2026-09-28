const db = require("../utils/db");

module.exports = {
  getSummary() {
    const revenue = db.get("revenue") || { total: 0, history: [] };
    return revenue;
  },

  add(amount, source) {
    const revenue = db.get("revenue") || { total: 0, history: [] };

    revenue.total += amount;
    revenue.history.push({
      amount,
      source,
      time: Date.now()
    });

    db.set("revenue", revenue);
    return revenue;
  }
};

