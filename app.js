const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 8080; // Use the environment port or default to 8080

// Connect to MongoDB
mongoose.connect('mongodb+srv://mouadchiali:mouadchiali@clustertestprojet.n7r4egf.mongodb.net/heartbb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1); // Exit the process if unable to connect to MongoDB
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

  if (!value) {
    return res.status(400).json({ error: 'Value is required' });
  }

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
