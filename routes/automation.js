const express = require("express");
const router = express.Router();

const automationEngine = require("../engines/automationEngine");

router.post("/", async (req, res) => {
  try {
    const { action } = req.body;

    const result = await automationEngine(action);

    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.toString() });
  }
});

module.exports = router;
