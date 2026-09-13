const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// -------------------------------
// Health Check Route
// -------------------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Madison backend is live' });
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
// Default Route
// -------------------------------
app.get('/', (req, res) => {
  res.json({ message: 'MAD Madison AI Backend Running' });
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
