const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// Use environment variables for MongoDB URI
const mongoURI = 'mongodb+srv://mouadchiali:mouadchiali@cluster0.4m2culi.mongodb.net/bpmdata';

// Connect to MongoDB Atlas
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB Atlas', err);
  });

// Define schema and model
const patientDataSchema = new mongoose.Schema({
  patientID: String,
  sensor: String,
  value: Number,
  timestamp: { type: Date, default: Date.now }
});

const PatientData = mongoose.model('PatientData', patientDataSchema);

// Create Express app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());  // Enable CORS

// Endpoint to get patient data by patientID
app.get('/patient/:patientID', async (req, res) => {
  const { patientID } = req.params;

  try {
    const patientData = await PatientData.find({ patientID });

    if (patientData.length > 0) {
      res.status(200).json(patientData);
    } else {
      res.status(404).json({ error: 'Patient data not found' });
    }
  } catch (err) {
    console.error('Error fetching patient data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to receive BPM data and update the value every second
app.post('/data', async (req, res) => {
  const { patientID, sensor, value } = req.body;

  try {
    // Find and update the existing entry or create a new one if it doesn't exist
    const updatedData = await PatientData.findOneAndUpdate(
      { patientID, sensor },
      { value, timestamp: new Date() },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    console.log('Data updated in MongoDB Atlas:', updatedData);
    res.status(200).json({ message: 'Data updated successfully', isConnected: 'true' });
  } catch (err) {
    console.error('Error saving data to MongoDB Atlas:', err);
    res.status(500).json({ error: 'Internal server error', isConnected: 'false' });
  }
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
