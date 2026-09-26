const express = require("express");
const router = express.Router();
const axios = require("axios");

/**
 * Madison AI Router
 * This is the intelligent bridge between the frontend chat
 * and the CEO operator engine.
 *
 * Madison interprets the user's message and decides which
 * operator route to call.
 */

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Basic intent detection
    const lower = message.toLowerCase();

    let endpoint = null;
    let payload = {};

    // EXECUTE CODE
    if (lower.startsWith("run ") || lower.includes("execute code")) {
      endpoint = "/operator/execute";
      payload.code = message.replace(/^run /i, "");
    }

    // READ FILE
    else if (lower.startsWith("read file")) {
      const path = message.replace(/read file/i, "").trim();
      endpoint = "/operator/file/read";
      payload.path = path;
    }

    // WRITE FILE
    else if (lower.startsWith("write file")) {
      const parts = message.replace(/write file/i, "").trim().split("::");
      endpoint = "/operator/file/write";
      payload.path = parts[0]?.trim();
      payload.content = parts[1]?.trim() || "";
    }

    // PATCH FILE
    else if (lower.startsWith("patch file")) {
      const parts = message.replace(/patch file/i, "").trim().split("::");
      endpoint = "/operator/file/patch";
      payload.path = parts[0]?.trim();
      payload.patch = {
        target: parts[1]?.trim(),
        replace: parts[2]?.trim()
      };
    }

    // DEPLOY
    else if (lower.includes("deploy")) {
      endpoint = "/operator/deploy";
      payload.service = "full-system";
    }

    // TASK ENGINE (default)
    else {
      endpoint = "/operator/task";
      payload.task = message;
    }

    // Forward to CEO operator engine
    const backendURL = process.env.BACKEND_URL || "http://localhost:3000";

    const result = await axios.post(`${backendURL}${endpoint}`, payload);

    res.json({
      success: true,
      route: endpoint,
      payload,
      result: result.data
    });

  } catch (err) {
    console.error("AI Route Error:", err);
    res.status(500).json({
      success: false,
      error: err.toString()
    });
  }
});

module.exports = router;
