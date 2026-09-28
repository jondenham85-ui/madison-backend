module.exports = {
  async process(audioData) {
    global.broadcast({
      type: "voice:waveform",
      level: Math.random()
    });

    return {
      transcript: "Voice command processed"
    };
  }
};
