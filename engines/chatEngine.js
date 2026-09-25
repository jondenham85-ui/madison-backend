module.exports = {
  async process(message) {
    global.broadcast({
      type: "chat:message",
      text: message
    });

    return {
      reply: `Madison AI received: ${message}`
    };
  }
};
