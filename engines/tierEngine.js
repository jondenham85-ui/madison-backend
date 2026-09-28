const db = require("../utils/db");

module.exports = {
  getTier(email) {
    const users = db.get("users") || {};
    return users[email]?.tier || "public";
  },

  setTier(email, tier) {
    const users = db.get("users") || {};
    users[email] = {
      email,
      tier,
      updated: Date.now()
    };
    db.set("users", users);
    return users[email];
  }
};
