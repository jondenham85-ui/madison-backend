const fetch = require('node-fetch');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

async function madisonOperator(type, payload) {
  const url = `${BACKEND_URL}/operator/${type}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  return await response.json();
}

/**
 * Madison auto-uses CEO powers based on plain language.
 */
async function madisonAI(message) {
  const text = message.toLowerCase();

  // Build website
  if (text.includes('build a website') || text.includes('make a website')) {
    return await madisonOperator('task', {
      task: 'Build a new Next.js website for MadisonAI and prepare it for deployment.'
    });
  }

  // Build app
  if (text.includes('build an app') || text.includes('make an app')) {
    return await madisonOperator('task', {
      task: 'Create a full mobile app using Expo for MadisonAI.'
    });
  }

  // Build game
  if (text.includes('build a game') || text.includes('make a game')) {
    return await madisonOperator('task', {
      task: 'Generate a browser-based JavaScript game and write all required files.'
    });
  }

  // Deploy
  if (text.includes('deploy') || text.includes('push live')) {
    return await madisonOperator('deploy', { service: 'full-system' });
  }

  // Run code (if you explicitly say “run code:”)
  if (text.startsWith('run code:')) {
    const code = message.replace(/run code:/i, '').trim();
    return await madisonOperator('execute', { code });
  }

  // Default: treat any other message as a task
  return await madisonOperator('task', { task: message });
}

module.exports = {
  madisonAI
};
