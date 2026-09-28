// src/ai/madison.js

async function madisonAI(message) {
  return {
    input: message,
    reply: "Madison online.",
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  madisonAI
};

