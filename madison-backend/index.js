import express from "express";
import cors from "cors";

// ShopMAD routes
import productsHandler from "../api/ShopMAD/products.js";
import adminHandler from "../api/ShopMAD/admin.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "madison-backend" });
});

// ShopMAD API
app.get("/api/shopmad/products", productsHandler);
app.post("/api/shopmad/admin", adminHandler);

app.listen(PORT, () => {
  console.log(`Madison backend running on port ${PORT}`);
});
