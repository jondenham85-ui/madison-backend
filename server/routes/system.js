import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    system: "MAD Madison Backend",
    version: "1.0.0",
    status: "online",
    model: "GPT-4o",
  });
});

export default router;
