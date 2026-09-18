import { Router } from "express";

const router = Router();

router.post("/checkout", (req, res) => {
  // existing Stripe logic here
  res.status(200).json({ message: "Stripe checkout placeholder" });
});

export default router;
