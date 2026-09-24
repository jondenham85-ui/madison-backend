import express from "express";

const router = express.Router();

let revenue = {
  total: 0,
  subscriptions: 0,
  refunds: 0,
};

router.get("/revenue", (req, res) => {
  res.json(revenue);
});

export default router;
