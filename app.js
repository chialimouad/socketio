const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://mouadchiali:mouadchiali@clustertestprojet.n7r4egf.mongodb.net/heartbeatDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define Heartbeat model
const heartbeatSchema = new mongoose.Schema({
  value: Number,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Heartbeat = mongoose.model('Heartbeat', heartbeatSchema);

app.use(bodyParser.json());

// Route to receive heartbeat data
app.post('/ap/heartbeat', async (req, res) => {
  try {
    const { heartbeat } = req.body;
    const newHeartbeat = new Heartbeat({ value: heartbeat });
    await newHeartbeat.save();
    res.status(201).send('Heartbeat data received');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
