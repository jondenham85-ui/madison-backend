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
