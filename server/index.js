import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";

import { PORT } from "./config.js";

// Core routes
import chatRoute from "./routes/chat.js";
import voiceRoute from "./routes/voice.js";
import systemRoute from "./routes/system.js";

// Admin modules
import adminChatRoute from "./routes/adminChat.js";
import adminSystemRoute from "./routes/adminSystem.js";
import adminVoiceRoute from "./routes/adminVoice.js";
import adminAutomationRoute from "./routes/adminAutomation.js";
import adminRevenueRoute from "./routes/adminRevenue.js";
import adminOwnerRoute from "./routes/adminOwner.js";

// Logger
import logger from "./utils/logger.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Core API routes
app.use("/chat", chatRoute);
app.use("/voice", voiceRoute);
app.use("/system", systemRoute);

// Admin API routes
app.use("/admin", adminChatRoute);
app.use("/admin", adminSystemRoute);
app.use("/admin", adminVoiceRoute);
app.use("/admin", adminAutomationRoute);
app.use("/admin", adminRevenueRoute);
app.use("/admin", adminOwnerRoute);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    status: "MAD Madison backend running",
    version: "1.0.0",
    routes: {
      chat: "/chat",
      voice: "/voice",
      system: "/system",
      admin: {
        chat: "/admin/chat-config",
        logs: "/admin/chat-logs",
        system: "/admin/system",
        voice: "/admin/voice-config",
        jobs: "/admin/jobs",
        revenue: "/admin/revenue",
        reboot: "/admin/reboot"
      }
    }
  });
});

// Start server
app.listen(PORT, () => {
  logger(`MAD Madison backend running on port ${PORT}`);
});

