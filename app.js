const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://mouadchiali:mouadchiali@clustertestprojet.n7r4egf.mongodb.net/heartb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define schema and model for sensor data
const sensorDataSchema = new mongoose.Schema({
  value: Number,
  timestamp: { type: Date, default: Date.now }
});

const SensorData = mongoose.model('SensorData', sensorDataSchema);

// Middleware
app.use(bodyParser.json());

// Route to receive data from NodeMCU
app.post('/data', (req, res) => {
  const { value } = req.body;

  const newData = new SensorData({ value });
  newData.save()
    .then(() => {
      console.log('Data saved successfully');
      res.sendStatus(200);
    })
    .catch(err => {
      console.error('Error saving data:', err);
      res.sendStatus(500);
    });
});

// Route to fetch data for Flutter app
app.get('/data', (req, res) => {
  SensorData.find({}, (err, data) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.sendStatus(500);
    } else {
      res.json(data);
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
