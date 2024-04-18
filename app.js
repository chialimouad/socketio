const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 3000;

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Flutter app connected');

  socket.on('disconnect', () => {
    console.log('Flutter app disconnected');
  });
});

app.post('/pulsedata', (req, res) => {
  const pulseData = req.body;
  console.log('Received pulse data:', pulseData);

  // Forward pulse data to Flutter app
  io.emit('pulseData', pulseData);

  res.send('Data received successfully');
});

server.listen(port, () => {
  console.log(`Node.js server listening at http://localhost:${port}`);
});
