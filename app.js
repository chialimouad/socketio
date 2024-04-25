const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect('mongodb+srv://mouadchiali:mouadchiali@clustertestprojet.n7r4egf.mongodb.net/doctors');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a schema for pulse sensor data
const pulseDataSchema = new mongoose.Schema({
  pulseData: Number,
  timestamp: { type: Date, default: Date.now }
});
const PulseData = mongoose.model('PulseData', pulseDataSchema);

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Route to handle incoming pulse sensor data
app.post('api/sensors/pulse', async (req, res) => {
  try {
    const { pulseData } = req.body;

    // Create a new PulseData document
    const newData = new PulseData({ pulseData });
    await newData.save();

    res.status(201).json({ message: 'Pulse data received and stored successfully' });
  } catch (error) {
    console.error('Error saving pulse data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
