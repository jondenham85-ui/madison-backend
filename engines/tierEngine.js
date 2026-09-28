// engines/tier.js
const tierEngine = require("./tierEngine");

module.exports = {
  getTier: (tier) => {
    if (typeof tierEngine.getTier === "function") {
      return tierEngine.getTier(tier);
    }
    return {
      tier,
      users: [],
      note: "Tier engine stub."
    };
  }
};
