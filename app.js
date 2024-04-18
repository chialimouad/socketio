const WebSocketServer = require('websocket').server;
const http = require('http');

const server = http.createServer();
const PORT = process.env.PORT || 8080; // Use the provided port or default to 8080

server.listen(PORT, () => {
  console.log(`WebSocket server is listening on port ${PORT}`);
});

const wsServer = new WebSocketServer({
  httpServer: server
});

wsServer.on('request', (request) => {
  const connection = request.accept(null, request.origin);
  console.log('WebSocket client connected');

  connection.on('message', (message) => {
    console.log('Received message:', message.utf8Data);

    // Forward message to all clients except the sender
    wsServer.connections.forEach((client) => {
      if (client !== connection && client.connected) {
        client.send(message.utf8Data);
      }
    });
  });

  connection.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});
