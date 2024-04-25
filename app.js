const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', function(socket) {
  console.log('A client connected');

  socket.on('disconnect', function() {
    console.log('A client disconnected');
  });
});

server.listen(3000, function() {
  console.log('Server is listening on port 3000');
});

app.post('/data', function(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString(); // convert Buffer to string
  });
  req.on('end', () => {
    console.log('Received data from NodeMCU:', body);
    // Emit the data to all connected clients
    io.emit('pulseData', body);
  });
});
