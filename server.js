const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// --------------------------------
// Allowed Origins for CORS
// --------------------------------
const allowedOrigins = [
  'https://madison-frontend.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL || 'https://madison-frontend.vercel.app'
];

// --------------------------------
// Middleware
// --------------------------------
app.use(express.json());
app.use(morgan('combined'));

// Enhanced CORS Configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

// --------------------------------
// Health Check Route
// --------------------------------
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Madison backend is live',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// --------------------------------
// System Diagnostic Route
// --------------------------------
app.get('/api/system/diagnostic', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    version: '1.0.0',
    timestamp: new Date().toISOString(),
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

// --------------------------------
// Owner Status Route
// --------------------------------
app.get('/api/owner/status', (req, res) => {
  res.json({
    owner: 'Jon & Ally',
    system: 'MAD Madison AI',
    backend: 'online',
    deployment: 'Render',
    timestamp: new Date().toISOString()
  });
});

// --------------------------------
// Default Route
// --------------------------------
app.get('/', (req, res) => {
  res.json({ 
    message: 'MAD Madison AI Backend Running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      diagnostic: '/api/system/diagnostic',
      ownerStatus: '/api/owner/status'
    }
  });
});
// -------------------------
// STRIPE ROUTES START HERE
// -------------------------

import Stripe from "stripe";
import bodyParser from "body-parser";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 5000,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        owner: "Jon Denham",
        system: "MAD Madison AI"
      }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post(
  "/api/stripe/webhook",
  bodyParser.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case "payment_intent.succeeded":
        console.log("Payment succeeded:", event.data.object.id);
        break;

      case "payment_intent.payment_failed":
        console.log("Payment failed:", event.data.object.id);
        break;

      default:
        console.log("Unhandled event:", event.type);
    }

    res.json({ received: true });
  }
);

app.get("/payment-success", (req, res) => {
  res.json({ status: "success", message: "Payment completed!" });
});

app.get("/payment-failed", (req, res) => {
  res.json({ status: "failed", message: "Payment failed." });
});

// --------------------------------
// 404 Handler
// --------------------------------
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.originalUrl,
    method: req.method
  });
});

// --------------------------------
// Error Handler
// --------------------------------
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// --------------------------------
// Start Server
// --------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MAD Madison AI backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS enabled for:`, allowedOrigins);
});
