// server.js — MAD Madison AI Backend (Render)

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

// ----------------------------
// BASIC MIDDLEWARE
// ----------------------------
app.use(express.json());
app.use(
  cors({
    origin: "*", // You can restrict this later to your Vercel domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ----------------------------
// OWNER CONFIG
// ----------------------------
const OWNERS = [
  "jondenham85@gmail.com",
  "allydenham013@gmail.com"
];

// ----------------------------
// OWNER LOGIN
// ----------------------------
app.post("/auth/owner/login", (req, res) => {
  const { email } = req.body;

  if (!email || !OWNERS.includes(email)) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  const token = jwt.sign(
    { email, role: "owner" },
    process.env.OWNER_JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.json({ success: true, token });
});

// ----------------------------
// OWNER TOKEN VALIDATION
// ----------------------------
app.post("/auth/owner/validate", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.json({ valid: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.OWNER_JWT_SECRET);

    if (!OWNERS.includes(decoded.email)) {
      return res.json({ valid: false });
    }

    return res.json({ valid: true });
  } catch (err) {
    return res.json({ valid: false });
  }
});

// ----------------------------
// OWNER-ONLY MIDDLEWARE
// ----------------------------
function ownerOnly(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token) {
    return res.status(403).json({ success: false, message: "Missing token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.OWNER_JWT_SECRET);

    if (!OWNERS.includes(decoded.email)) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    req.owner = decoded.email;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
}

// ----------------------------
// HEALTH CHECK
// ----------------------------
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "MAD Madison AI Backend",
    ownerAuth: true
  });
});

// ----------------------------
// OWNER-ONLY TEST ROUTE
// ----------------------------
app.get("/owner/data", ownerOnly, (req, res) => {
  res.json({
    message: "Owner access granted",
    owner: req.owner
  });
});

// ----------------------------
// START SERVER
// ----------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MAD Madison AI backend running on port ${PORT}`);
});
