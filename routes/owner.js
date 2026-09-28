const express = require("express");
const router = express.Router();

const product = require("../engines/product");
const revenue = require("../engines/revenue");
const workflow = require("../engines/workflow");
const tier = require("../engines/tier");

router.get("/", async (req, res) => {
  try {
    const data = {
      products: product.getAll(),
      revenue: revenue.getSummary(),
      workflows: workflow.getAll(),
      users: tier.getTier("all")
    };

    res.json({
      ok: true,
      owner: true,
      data
    });
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

module.exports = router;
