import express from "express";
import cors from "cors";

// ShopMAD routes
import productsHandler from "../api/shopmad/products.js";
import adminHandler from "../api/shopmad/admin.js";

// Stripe backend (kept for stability, not active)
import stripeBackend from "../api/Stripe/backend.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "madison-backend" });
});

// ShopMAD API
app.get("/api/shopmad/products", productsHandler

