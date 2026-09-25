const express = require("express");
const cors = require("cors");
const http = require("http");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// WebSocket server
require("./ws")(server);

// Routes
app.use("/api/tier", require("./routes/tier"));
app.use("/api/workflow", require("./routes/workflow"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/voice", require("./routes/voice"));
app.use("/api/automation", require("./routes/automation"));
app.use("/api/admin", require("./routes/admin"));

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Backend running on ${PORT}`));
