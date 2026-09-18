import express from "express";
import cors from "cors";
import productsHandler from "../api/shopmad/products.js";
import adminHandler from "../api/shopmad/admin.js";
import stripeBackend from "../api/Stripe/backend.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ShopMAD routes
app.get("/api/shopmad/products", productsHandler);
app.post("/api/shopmad/admin", adminHandler);

// Stripe backend (existing)
app.use("/api/stripe", stripeBackend);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "madison-backend" });
});

app.listen(PORT, () => {
  console.log(`Madison backend running on port ${PORT}`);
});
