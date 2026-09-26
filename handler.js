const fetch = require('node-fetch');

/**
 * Madison AI Handler
 * This file connects Madison's intelligence to her CEO operator powers.
 */

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

/**
 * Core function: Madison sends commands to her operator routes
 */
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
 * Madison interprets user messages and decides what operator action to take
 */
async function madisonAI(message) {
  message = message.toLowerCase();

  // Build a website
  if (message.includes('build a website')) {
    return await madisonOperator('task', {
      task: 'Build a new website using Next.js and deploy it.'
    });
  }

  // Build an app
  if (message.includes('build an app')) {
    return await madisonOperator('task', {
      task: 'Create a full mobile app using Expo and deploy it.'
    });
  }

  // Build a game
  if (message.includes('build a game')) {
    return await madisonOperator('task', {
      task: 'Generate a JavaScript browser game and write all files.'
    });
  }

  // Run backend code
  if (message.startsWith('run code:')) {
    const code = message.replace('run code:', '').trim();
    return await madisonOperator('execute', { code });
  }

  // Write a file
  if (message.startsWith('write file')) {
    const parts = message.split('|');
    const path = parts[1].trim();
    const content = parts[2].trim();

    return await madisonOperator('file/write', { path, content });
  }

  // Patch a file
  if (message.startsWith('patch file')) {
    const parts = message.split('|');
    const path = parts[1].trim();
    const target = parts[2].trim();
    const replace = parts[3].trim();

    return await madisonOperator('file/patch', {
      path,
      patch: { target, replace }
    });
  }

  // Deploy
  if (message.includes('deploy')) {
    return await madisonOperator('deploy', {
      service: 'full-system'
    });
  }

  // Default: send to task engine
  return await madisonOperator('task', {
    task: message
  });
}

module.exports = {
  madisonAI
};
