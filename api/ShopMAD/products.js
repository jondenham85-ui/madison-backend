export default async function productsHandler(req, res) {
  try {
    const products = [
      {
        id: "1",
        name: "MAD AI Starter Pack",
        description: "Basic tools to begin using MAD Madison AI.",
        price: 25,
        image: "/sample1.png"
      },
      {
        id: "2",
        name: "MAD Creator Bundle",
        description: "Advanced creation tools for serious users.",
        price: 40,
        image: "/sample2.png"
      },
      {
        id: "3",
        name: "MAD Pro Suite",
        description: "Full suite of MAD Madison AI capabilities.",
        price: 60,
        image: "/sample3.png"
      }
    ];

    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ error: "Failed to load ShopMAD products" });
  }
}
