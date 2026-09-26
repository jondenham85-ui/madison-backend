const express = require("express");
const router = express.Router();

// This is your CEO operator engine
const operator = require("../operator");

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Madison CEO: run the operator task
    const result = await operator.runTask(message);

    res.json({ result });
  } catch (err) {
    console.error("AI Route Error:", err);
    res.status(500).json({ error: "AI route failed" });
  }
});

module.exports = router;
