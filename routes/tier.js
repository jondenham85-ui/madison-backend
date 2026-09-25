const express = require("express");
const router = express.Router();
const tierEngine = require("../engines/tierEngine");

router.get("/:userId", (req, res) => {
  res.json({ tier: tierEngine.getTier(req.params.userId) });
});

router.post("/upgrade", (req, res) => {
  const { userId, tier } = req.body;
  res.json({ tier: tierEngine.setTier(userId, tier) });
});

module.exports = router;
