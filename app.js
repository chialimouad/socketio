const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;
const mongoURI = 'mongodb+srv://mouadchiali:mouadchiali@clustertestprojet.n7r4egf.mongodb.net/docbpm';

// Define schema for data
const dataSchema = new mongoose.Schema({
  heartbeat: Number
});

// Define model for data
const Data = mongoose.model('Data', dataSchema);

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB:', error));

// Route to handle POST requests for inserting data
app.post('/api/data', async (req, res) => {
  try {
    const data = req.body;
    await Data.create(data);
    res.status(201).send('Data inserted into MongoDB');
  } catch (error) {
    console.error('Error inserting data into MongoDB:', error);
    res.status(500).send('Internal server error');
  }
});

// Route to handle GET requests for fetching data
app.get('/api/data', async (req, res) => {
  try {
    const data = await Data.find();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data from MongoDB:', error);
    res.status(500).send('Internal server error');
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
