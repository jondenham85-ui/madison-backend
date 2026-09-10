require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');

const app = express();

// --- Env config ---
const PORT = process.env.PORT || 3000;
const MAD_SECRET = process.env.MAD_SECRET || 'madison-super-secret-key-3349987105';
const OWNER_EMAILS = (process.env.OWNER_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean);
const APP_NAME = process.env.APP_NAME || 'MAD Madison AI';
const MAD_API_URL = process.env.MAD_API_URL || '';

// --- Middleware ---
app.use(express.json());
app.use(morgan('dev'));
app.use(
  cors({
    origin: [
      'https://madison-frontend-df3c.vercel.app',
      'https://madmadisonai.com',
      'https://www.madmadisonai.com'
    ],
    credentials: true
  })
);

// --- Helpers ---
function isOwner(email) {
  return OWNER_EMAILS.includes(email);
}

function authRequired(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    req.user = jwt.verify(token, MAD_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// --- Root / health ---
app.get('/', (req, res) => {
  res.json({
    app: APP_NAME,
    status: 'ok',
    backend: 'MAD Madison AI API',
    madApiUrl: MAD_API_URL,
    owners: OWNER_EMAILS
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// --- Auth ---
app.post('/auth/login', (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const role = isOwner(email) ? 'owner' : 'user';
  const token = jwt.sign({ email, role }, MAD_SECRET, { expiresIn: '7d' });

  res.json({ token, role, email });
});

// --- Madison chat (stub) ---
app.post('/madison/chat', authRequired, async (req, res) => {
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const reply = `Madison received: "${message}". This is a placeholder until the full AI engine is wired in.`;

  res.json({
    user: req.user.email,
    role: req.user.role,
    message,
    reply
  });
});

// --- 404 ---
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

// --- Error handler ---
app.use((err, req, res, next) => {
  console.error('API error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// --- Start ---
app.listen(PORT, () => {
  console.log(`${APP_NAME} backend listening on port ${PORT}`);
});
