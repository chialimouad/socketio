const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection URI
const mongoUri = 'mongodb+srv://mouadchiali:mouadchiali@clustertestprojet.n7r4egf.mongodb.net/doctors';

// Define Mongoose schema
const sensorDataSchema = new mongoose.Schema({
  value: Number, // Assuming 'value' is the field you want to store
  // Add more fields if needed
});

// Define Mongoose model
const SensorData = mongoose.model('SensorData', sensorDataSchema);

app.use(express.json());

// Create a connection to MongoDB Atlas
const connection = mongoose.createConnection(mongoUri);

// Handle connection events
connection.on('connected', () => {
  console.log('Connected to MongoDB Atlas');
});

connection.on('error', (err) => {
  console.error('Error connecting to MongoDB Atlas:', err);
});

// Handle POST requests to /data
app.post('/data', async (req, res) => {
  const data = req.body;

  try {
    // Create a new document based on the schema
    const sensorData = new SensorData(data);
    await sensorData.save();

    res.status(200).send('Data received and stored successfully');
  } catch (error) {
    console.error('Error storing data:', error);
    res.status(500).send('Error storing data');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
