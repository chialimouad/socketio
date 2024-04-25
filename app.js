const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('Received: %s', message);
    // Handle the incoming message (store, process, etc.)
  });
});

server.listen(3000, function () {
  console.log('Server is listening on port 3000');
});

app.post('/data', function (req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString(); // convert Buffer to string
  });
  req.on('end', () => {
    console.log('Received data from NodeMCU:', body);
    // Broadcast the data to all connected clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(body);
      }
    });
  });
});
