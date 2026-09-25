const express = require("express");
const router = express.Router();
const chatEngine = require("../engines/chatEngine");

router.post("/", async (req, res) => {
  const { message } = req.body;
  res.json(await chatEngine.process(message));
});

module.exports = router;
