const express = require("express");
const router = express.Router();
const voiceEngine = require("../engines/voiceEngine");

router.post("/", async (req, res) => {
  const { audio } = req.body;
  res.json(await voiceEngine.process(audio));
});

module.exports = router;
