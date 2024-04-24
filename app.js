const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const PORT = 3000;
const mongoUri = 'mongodb+srv://mouadchiali:mouadchiali@clustertestprojet.n7r4egf.mongodb.net/bp';

app.use(express.json());

// Handle POST requests to /data
app.post('/data', async (req, res) => {
  const data = req.body;

  // Connect to MongoDB Atlas
  const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();

    // Insert data into MongoDB
    const db = client.db('<dbname>');
    const collection = db.collection('sensor_data');
    await collection.insertOne(data);

    res.status(200).send('Data received and stored successfully');
  } catch (error) {
    console.error('Error storing data:', error);
    res.status(500).send('Error storing data');
  } finally {
    await client.close();
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
