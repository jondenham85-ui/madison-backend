const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// TEMP AUTH
app.use((req, res, next) => {
  req.user = {
    id: 0,
    email: 'madison@system.ai',
    role: 'operator'
  };
  next();
});

// ROUTES
app.use("/api", require("./routes/ai"));
app.use("/automation", require("./routes/automation"));
app.use("/chat", require("./routes/chat"));
app.use("/tier", require("./routes/tier"));
app.use("/voice", require("./routes/voice"));
app.use("/workflow", require("./routes/workflow"));
app.use("/admin", require("./routes/admin"));

// HEALTH CHECK
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Madison Backend',
    operator: 'Madison (CEO)'
  });
});

// START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Madison backend running on port ${port}`);
});
