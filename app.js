const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://mouadchiali:mouadchiali@clustertestprojet.n7r4egf.mongodb.net/mydatabase?retryWrites=true&w=majority', {
useNewUrlParser: true,
useUnifiedTopology: true
}).then(() => {
console.log('Connected to MongoDB Atlas');
}).catch((err) => {
console.error('Error connecting to MongoDB Atlas', err);
});

// Define a schema for the patient data
const patientDataSchema = new mongoose.Schema({
patientID: String,
sensor: String,
value: Number,
timestamp: { type: Date, default: Date.now }
});

// Create a model based on the schema
const PatientData = mongoose.model('PatientData', patientDataSchema);

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to receive data from NodeMCU devices
app.post('/data', (req, res) => {
const { patientID, sensor, value } = req.body;

// Validate the incoming data
if (!patientID || !sensor || !value) {
return res.status(400).json({ error: 'Invalid data format' });
}

// Create a new patient data document and save it to MongoDB Atlas
const newPatientData = new PatientData({ patientID, sensor, value });
newPatientData.save().then(() => {
console.log('Data saved to MongoDB Atlas:', newPatientData);
res.status(200).send('Data saved successfully');
}).catch((err) => {
console.error('Error saving data to MongoDB Atlas:', err);
res.status(500).send('Internal server error');
});
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
console.log('Server listening at http://localhost:${port}');
})