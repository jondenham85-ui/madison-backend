export default async function adminHandler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, description, price, image } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // TODO: save to database later
  res.status(200).json({
    message: "Product added successfully",
    product: { name, description, price, image }
  });
}
