const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const PORT = process.env.PORT || 3000;

// Connection URL and database name
const uri = 'mongodb+srv://dellesheoniadixon2:k9UyT796OyDNGNlB@ddixonmdb.05vfedo.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true });

// Connect to MongoDB
async function connect() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }
}
connect();

// Middleware to parse request body as JSON
app.use(bodyParser.json());

// Endpoint to get all tickets
app.get('/rest/list', async (req, res) => {
  const tickets = client.db('Phase-ll').collection('CMPS415');
  const result = await tickets.find().toArray();
  res.send(result);
});

// Endpoint to get a single ticket by id
app.get('/rest/ticket/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const tickets = client.db('Phase-ll').collection('CMPS415');
  const ticket = await tickets.findOne({ id: id });

  if (!ticket) {
    res.status(404).send('Ticket not found');
  } else {
    res.send(ticket);
  }
});

// Endpoint to create a new ticket
app.post('/rest/ticket', async (req, res) => {
  const ticket = req.body;
  ticket.id = Date.now(); // Assign a unique id
  const tickets = client.db('Phase-ll').collection('CMPS415');
  await tickets.insertOne(ticket);
  console.log(`Created ticket with id ${ticket.id}`);
  res.send(ticket);
});

// Endpoint to update a ticket by id
app.put('/rest/ticket/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const update = req.body;
  const tickets = client.db('Phase-ll').collection('CMPS415');
  const result = await tickets.updateOne({ id: id }, { $set: update });

  if (result.modifiedCount === 0) {
    res.status(404).send('Ticket not found');
  } else {
    console.log(`Updated ticket with id ${id}`);
    res.send('Ticket updated successfully');
  }
});

// Endpoint to delete a ticket by id
app.delete('/rest/ticket/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const tickets = client.db('Phase-ll').collection('CMPS415');
  const result = await tickets.deleteOne({ id: id });

  if (result.deletedCount === 0) {
    res.status(404).send('Ticket not found');
  } else {
    console.log(`Deleted ticket with id ${id}`);
    res.send('Ticket deleted successfully');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



