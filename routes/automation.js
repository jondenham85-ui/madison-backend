const express = require("express");
const router = express.Router();
const automationEngine = require("../engines/automationEngine");

router.post("/trigger", (req, res) => {
  const { name } = req.body;
  res.json(automationEngine.trigger(name));
});

module.exports = router;
