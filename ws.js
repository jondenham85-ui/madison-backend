const WebSocket = require("ws");

let clients = [];

module.exports = (server) => {
  const wss = new WebSocket.Server({ server, path: "/ws" });

  wss.on("connection", (ws) => {
    clients.push(ws);
    console.log("Client connected");

    ws.on("close", () => {
      clients = clients.filter((c) => c !== ws);
      console.log("Client disconnected");
    });
  });

  global.broadcast = (event) => {
    clients.forEach((ws) => {
      ws.send(JSON.stringify(event));
    });
  };
};
