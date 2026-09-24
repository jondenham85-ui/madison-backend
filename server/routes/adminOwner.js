import express from "express";

const router = express.Router();

router.post("/reboot", (req, res) => {
  res.json({ ok: true, message: "Reboot triggered." });
  process.exit(1);
});

export default router;
