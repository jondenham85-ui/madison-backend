const express = require("express");
const router = express.Router();
const operator = require("../operator/index");

router.post("/", async (req, res) => {
  const { message } = req.body;
  res.json(await operator.runTask(message));
});

module.exports = router;
