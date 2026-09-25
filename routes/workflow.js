const express = require("express");
const router = express.Router();
const workflowEngine = require("../engines/workflowEngine");

router.post("/run", (req, res) => {
  const { name, payload } = req.body;
  res.json(workflowEngine.runWorkflow(name, payload));
});

module.exports = router;
