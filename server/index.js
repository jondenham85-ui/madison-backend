import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import { PORT } from "./config.js";
import chatRoute from "./routes/chat.js";
import voiceRoute from "./routes/voice.js";
import systemRoute from "./routes/system.js";
import logger from "./utils/logger.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.use("/chat", chatRoute);
app.use("/voice", voiceRoute);
app.use("/system", systemRoute);

app.get("/", (req, res) => {
  res.json({ status: "MAD Madison backend running" });
});

app.listen(PORT, () => {
  logger(`MAD Madison backend running on port ${PORT}`);
});
