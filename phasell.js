const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const PORT = process.env.PORT || 3000;
const uri = 'mongodb+srv://dellesheoniadixon2:k9UyT796OyDNGNlB@ddixonmdb.05vfedo.mongodb.net/?retryWrites=true&w=majority'; // Replace with your MongoDB URI

app.use(bodyParser.json());

// Connect to MongoDB
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(async (err) => {
  if (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }

  console.log('Connected to MongoDB');

  // Get database and collection
  const db = client.db('Phase-ll'); // Replace with your database name
  const ticketsCollection = db.collection('CMPS415'); // Replace with your collection name

  // Endpoint to get all tickets
  app.get('/rest/list', async (req, res) => {
    try {
      const result = await ticketsCollection.find().toArray();
      res.send(result);
    } catch (err) {
      console.error('Failed to get tickets from MongoDB:', err);
      res.status(500).send('Failed to get tickets');
    }
  });

  // Endpoint to get a single ticket by id
  app.get('/rest/ticket/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const ticket = await ticketsCollection.findOne({ id });

      if (!ticket) {
        res.status(404).send('Ticket not found');
      } else {
        res.send(ticket);
      }
    } catch (err) {
      console.error('Failed to get ticket from MongoDB:', err);
      res.status(500).send('Failed to get ticket');
    }
  });

  // Endpoint to create a new ticket
  app.post('/rest/ticket', async (req, res) => {
    try {
      const ticket = req.body;
      ticket.id = Date.now(); // Assign a unique id
      await ticketsCollection.insertOne(ticket);
      console.log(`Created ticket with id ${ticket.id}`);
      res.send(ticket);
    } catch (err) {
      console.error('Failed to create ticket in MongoDB:', err);
      res.status(500).send('Failed to create ticket');
    }
  });

  // Endpoint to update a ticket
  app.put('/rest/ticket/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const ticket = req.body;
      await ticketsCollection.updateOne({ id }, { $set: ticket });

      res.send(`Updated ticket with id ${id}`);
    } catch (err) {
      console.error('Failed to update ticket in MongoDB:', err);
      res.status(500).send('Failed to update ticket');
    }
  });

  // Endpoint to delete a ticket
  app.delete('/rest/ticket/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await ticketsCollection.deleteOne({ id });

      res.send(`Deleted ticket with id ${id}`);
    } catch (err) {
      console.error('Failed to delete ticket in MongoDB:', err);
      res.status(500).send('Failed to delete ticket');
    }
  });

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
``
