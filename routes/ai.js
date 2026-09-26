const express = require("express");
const router = express.Router();
const operator = require("../src/operator/index").default;

/**
 * Madison AI Router
 * Intelligent bridge between frontend chat and CEO operator engine.
 */

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const lower = message.toLowerCase();
    let result;

    // EXECUTE CODE
    if (lower.startsWith("run ") || lower.includes("execute code")) {
      const code = message.replace(/^run /i, "");
      result = await operator.executeCode(code);
    }

    // READ FILE
    else if (lower.startsWith("read file")) {
      const path = message.replace(/read file/i, "").trim();
      result = await operator.readFile(path);
    }

    // WRITE FILE
    else if (lower.startsWith("write file")) {
      const parts = message.replace(/write file/i, "").trim().split("::");
      const path = parts[0]?.trim();
      const content = parts[1]?.trim() || "";
      result = await operator.writeFile(path, content);
    }

    // PATCH FILE
    else if (lower.startsWith("patch file")) {
      const parts = message.replace(/patch file/i, "").trim().split("::");
      const path = parts[0]?.trim();
      const patch = {
        target: parts[1]?.trim(),
        replace: parts[2]?.trim()
      };
      result = await operator.patchFile(path, patch);
    }

    // DEPLOY
    else if (lower.includes("deploy")) {
      result = await operator.deploy("full-system");
    }

    // DEFAULT: TASK ENGINE
    else {
      result = await operator.runTask(message);
    }

    res.json({ success: true, result });

  } catch (err) {
    console.error("AI Route Error:", err);
    res.status(500).json({
      success: false,
      error: err.toString()
    });
  }
});

module.exports = router;
