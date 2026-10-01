const express = require("express");
const router = express.Router();
const operator = require("../operator");

/**
 * Madison AI Router
 * Intelligent bridge between frontend chat and CEO operator engine.
 */

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const lower = message.toLowerCase();
    let result;

    // DEFAULT: TASK ENGINE
    // Route all messages through operator task handler
    result = await operator.runTask({ mode: "task", data: { message } });

    res.json({ success: true, result });

  } catch (err) {
    console.error("AI Route Error:", err);
    res.status(500).json({
      success: false,
      error: err.toString()
    });
  }
});

module.exports = router;
