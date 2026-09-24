import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";

import { PORT } from "./config.js";

// ROUTES
import chatRoute from "./routes/chat.js";
import voiceRoute from "./routes/voice.js";
import systemRoute from "./routes/system.js";
import adminChatRoute from "./routes/adminChat.js";

// LOGGER
import logger from "./utils/logger.js";

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// ROUTE MOUNTING
app.use("/chat", chatRoute);
app.use("/voice", voiceRoute);
app.use("/system", systemRoute);
app.use("/admin", adminChatRoute);

// ROOT ENDPOINT
app.get("/", (req, res) => {
  res.json({
    status: "MAD Madison backend running",
    version: "1.0.0",
    routes: {
      chat: "/chat",
      voice: "/voice",
      system: "/system",
      admin: "/admin"
    }
  });
});

// START SERVER
app.listen(PORT, () => {
  logger(`MAD Madison backend running on port ${PORT}`);
});
