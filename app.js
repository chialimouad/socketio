const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT ||3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/heart-rate', (req, res) => {
  const heartRate = req.body.heartRate;
  console.log('Received heart rate:', heartRate);
  // Here you can do further processing or send it to clients connected via WebSocket
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
