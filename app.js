const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Board, Sensor } = require('johnny-five');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Atlas connection URI
const mongoURI = 'mongodb+srv://mouadchiali:mouadchiali@clustertestprojet.n7r4egf.mongodb.net/doctors';

// Connect to MongoDB Atlas
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Atlas connected'))
  .catch(err => console.log('MongoDB Atlas connection error:', err));

// Define schema for sensor data
const sensorDataSchema = new mongoose.Schema({
  api_key: String,
  sensor: String,
  value1: Number,
});

// Create model for sensor data
const SensorData = mongoose.model('SensorData', sensorDataSchema);

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route to handle incoming sensor data
app.post('/update-sensor', (req, res) => {
  const { api_key, sensor, value1 } = req.body;

  const newData = new SensorData({
    api_key,
    sensor,
    value1,
  });

  newData.save()
    .then(() => {
      console.log('Sensor data saved to MongoDB Atlas:', newData);
      res.status(200).send('Data received and saved successfully');
    })
    .catch(err => {
      console.error('Error saving sensor data:', err);
      res.status(500).send('Error saving sensor data');
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Johnny-Five code to read sensor data and send it to Node.js server
const board = new Board();

board.on('ready', () => {
  const sensor = new Sensor({
    pin: 'A0',
    freq: 1000, // Read every 1 second
  });

  sensor.on('change', () => {
    const pulseValue = sensor.value;

    // Send sensor data to Node.js server
    sendDataToServer({
      api_key: 'YOUR_API_KEY',
      sensor: 'PulseSensor',
      value1: pulseValue,
    });
  });
});

function sendDataToServer(data) {
  // Make HTTP POST request to Node.js server
  fetch('http://localhost:3000/update-sensor', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => {
    if (response.ok) {
      console.log('Sensor data sent successfully');
    } else {
      console.error('Failed to send sensor data:', response.statusText);
    }
  })
  .catch(error => {
    console.error('Error sending sensor data:', error);
  });
}
