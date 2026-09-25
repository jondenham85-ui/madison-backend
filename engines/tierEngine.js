const db = require("../utils/db");

module.exports = {
  getTier(userId) {
    const tiers = db.read("tiers");
    return tiers[userId] || "public";
  },

  setTier(userId, tier) {
    const tiers = db.read("tiers");
    tiers[userId] = tier;
    db.write("tiers", tiers);

    global.broadcast({
      type: "tier:update",
      userId,
      tier
    });

    return tier;
  }
};
