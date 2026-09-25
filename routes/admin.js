const express = require("express");
const router = express.Router();
const db = require("../utils/db");

router.get("/revenue", (req, res) => {
  res.json(db.read("revenue"));
});

router.get("/system", (req, res) => {
  res.json(db.read("system"));
});

module.exports = router;
