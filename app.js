const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('message', (message) => {
    console.log('Received heartbeat:', message);
    // Handle heartbeat data here (store in databayse, etc.)
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log('Server listening on port ');
});
