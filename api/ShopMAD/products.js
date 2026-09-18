import { getProducts } from "./model.js";

export default async function handler(req, res) {
  try {
    const products = await getProducts();
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ error: "Failed to load ShopMAD products" });
  }
}
