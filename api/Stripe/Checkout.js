import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { amount, description } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: description },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: "https://madmadisonai.com/success",
      cancel_url: "https://madmadisonai.com/cancel",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: "Stripe session failed" });
  }
}
