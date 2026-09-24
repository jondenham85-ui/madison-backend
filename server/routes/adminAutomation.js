import express from "express";

const router = express.Router();

let jobs = [];

router.get("/jobs", (req, res) => {
  res.json({ jobs });
});

router.post("/jobs", (req, res) => {
  const { job } = req.body;
  jobs.push({
    id: `${Date.now()}`,
    text: job,
  });
  res.json({ ok: true });
});

export default router;
