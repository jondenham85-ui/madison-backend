const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
  });
});

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

app.get('/api/owner/status', (req, res) => {
  res.json({
    owner: 'Jon Denham',
    system: 'MAD Madison AI',
    backend: 'online',
    deployment: 'render',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.send('MAD Madison Backend is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
