const express = require('express');
const cors = require('cors');

const operator = require('./operator');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'MadMadison backend' });
});

app.post('/operator/task', async (req, res) => {
  try {
    const result = await operator.runTask(req.body);
    res.json({ ok: true, result });
  } catch (err) {
    console.error('Operator task error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/operator/ceo', async (req, res) => {
  try {
    const payload = { ...req.body, mode: 'ceo' };
    const result = await operator.runTask(payload);
    res.json({ ok: true, result });
  } catch (err) {
    console.error('CEO mode error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
