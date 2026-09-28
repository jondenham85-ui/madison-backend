module.exports = {
  trigger(name) {
    global.broadcast({
      type: "automation:run",
      name
    });

    return { status: "ok", name };
  }
};
