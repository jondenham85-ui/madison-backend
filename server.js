const express = require('express');
const cors = require('cors');

// -------------------------------
// Stripe Initialization
// -------------------------------
const stripeSecret = process.env.STRIPE_SECRET_KEY;

let stripe = null;
if (!stripeSecret) {
  console.warn("⚠️ STRIPE_SECRET_KEY is missing — Stripe routes disabled");
} else {
  stripe = require('stripe')(stripeSecret);
}

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// -------------------------------
// Health Check Route
// -------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Madison backend is live'
  });
});

// -------------------------------
// System Diagnostic Route
// -------------------------------
app.get('/api/system/diagnostic', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    version: '1.0.0',
    engines: {
      owner: true,
      revenue: true,
      content: true,
      traffic: true,
      funnel: true,
      scaling: true
    }
  });
});

// -------------------------------
// Owner Status Route
// -------------------------------
app.get('/api/owner/status', (req, res) => {
  res.json({
    owner: 'Jon & Ally',
    system: 'MAD Madison AI',
    backend: 'online'
  });
});

// -------------------------------
// Stripe Test Checkout Route
// -------------------------------
app.post('/api/stripe/checkout', async (req, res) => {
  if (!stripe) {
    return res.status(500).json({
      error: "Stripe is not configured — missing STRIPE_SECRET_KEY"
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'MAD Madison AI Test Charge'
            },
            unit_amount: 500 // $5.00
          },
          quantity: 1
        }
      ],
      success_url: process.env.STRIPE_SUCCESS_URL || 'https://madmadisonai.com/success',
      cancel_url: process.env.STRIPE_CANCEL_URL || 'https://madmadisonai.com/cancel'
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Checkout Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------
// Default Route
// -------------------------------
app.get('/', (req, res) => {
  res.json({
    message: 'MAD Madison AI Backend Running with Stripe Enabled'
  });
});

// -------------------------------
// 404 Handler
// -------------------------------
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.originalUrl
  });
});

// -------------------------------
// Start Server
// -------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MAD Madison AI backend running on port ${PORT}`);
});
