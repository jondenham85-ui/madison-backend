const aiRoutes = require('./routes/ai');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

/**
 * TEMP AUTH:
 * Madison is always logged in as CEO operator.
 * Replace later with real auth.
 */
app.use((req, res, next) => {
  req.user = {
    id: 0,
    email: 'madison@system.ai',
    role: 'operator'
  };
  next();
});

/**
 * PERMISSION MIDDLEWARE
 */
function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

function requireOperator(req, res, next) {
  if (!req.user || (req.user.role !== 'operator' && req.user.role !== 'admin')) {
    return res.status(403).json({ error: 'Operator access required' });
  }
  next();
}

/**
 * HEALTH CHECK
 */
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Madison Backend',
    operator: 'Madison (CEO)'
  });
});

/**
 * CEO OPERATOR ROUTES
 */

/* Execute backend code */
app.post('/operator/execute', requireAuth, requireOperator, async (req, res) => {
  const { code } = req.body;

  try {
    const result = await eval(code);
    res.json({ success: true, result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.toString() });
  }
});

/* Read file */
app.post('/operator/file/read', requireAuth, requireOperator, (req, res) => {
  const { path } = req.body;

  try {
    const content = fs.readFileSync(path, 'utf8');
    res.json({ success: true, content });
  } catch (err) {
    res.status(400).json({ success: false, error: err.toString() });
  }
});

/* Write file */
app.post('/operator/file/write', requireAuth, requireOperator, (req, res) => {
  const { path, content } = req.body;

  try {
    fs.writeFileSync(path, content);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.toString() });
  }
});

/* Patch file */
app.post('/operator/file/patch', requireAuth, requireOperator, (req, res) => {
  const { path, patch } = req.body; // { target: "...", replace: "..." }

  try {
    let content = fs.readFileSync(path, 'utf8');
    content = content.replace(patch.target, patch.replace);
    fs.writeFileSync(path, content);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.toString() });
  }
});

/* Deployment trigger (stub) */
app.post('/operator/deploy', requireAuth, requireOperator, async (req, res) => {
  const { service } = req.body;

  res.json({
    success: true,
    message: `Deployment triggered for ${service}`
  });
});

/* Task engine (AI will interpret tasks later) */
app.post('/operator/task', requireAuth, requireOperator, async (req, res) => {
  const { task } = req.body;

  const result = {
    received: task,
    status: 'pending-implementation'
  };

  res.json({ success: true, result });
});

/**
 * NORMAL ROUTES
 */
app.get('/products', async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

app.get('/leads', async (req, res) => {
  const leads = await prisma.lead.findMany();
  res.json(leads);
});

app.get('/customers', async (req, res) => {
  const customers = await prisma.customer.findMany();
  res.json(customers);
});

app.get('/revenue', async (req, res) => {
  const revenue = await prisma.revenue.findMany();
  res.json(revenue);
});

/**
 * START SERVER
 */
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Madison backend running on port ${port}`);
});
