const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
  });
});

// System Diagnostic Route
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
      scaling: true,
    },
    timestamp: new Date().toISOString(),
  });
});

// Owner Status Route
app.get('/api/owner/status', (req, res) => {
  res.json({
    owner: 'Jon Denham',
    system: 'MAD Madison AI',
    backend: 'online',
    deployment: 'render',
    timestamp: new Date().toISOString(),
  });
});

// Root
app.get('/', (req, res) => {
  res.send('MAD Madison Backend is running');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
