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

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to get all tickets
app.get('/rest/list', async (req, res) => {
  const tickets = client.db('Phase-ll').collection('CMPS415');
  const result = await tickets.find().toArray();
  res.send(result);
});

// Define a route for retrieving a ticket by id
app.get('/rest/ticket/:id', async (req, res) => {
  const ticketId = parseFloat(req.params.id); // Parse id as double
  const tickets = client.db('Phase-ll').collection('CMPS415');

  // Use findOne() method to find a document by id
  const ticket = await tickets.findOne({ id: ticketId });

  if (ticket) {
    console.log(`Retrieved ticket with id ${ticketId}`);
    res.send(ticket);
  } else {
    console.log(`Ticket with id ${ticketId} not found`);
    res.status(404).send(`Ticket with id ${ticketId} not found`);
  }
});

// Define a route for creating a new ticket
app.post('/rest/ticket', async (req, res) => {
  // Confirm that req.body is an object
  if (typeof req.body === 'object' && !Array.isArray(req.body)) {
    const ticket = req.body;
    ticket.id = Date.now(); // Assign a unique id

    // Confirm that ticket is an object
    if (typeof ticket === 'object' && !Array.isArray(ticket)) {
      const tickets = client.db('Phase-ll').collection('CMPS415');
      await tickets.insertOne(ticket);
      console.log(`Created ticket with id ${ticket.id}`);
      res.send(ticket);
    } else {
      console.log('Ticket data is not a valid object');
      res.status(400).send('Ticket data is not a valid object');
    }
  } else {
    console.log('Request body is not a valid object');
    res.status(400).send('Request body is not a valid object');
  }
});

// Define a route for handling form submission
app.post('/post.html', async (req, res) => {
  // Access form data from req.body
  const formData = req.body;
  // Process form data and create a new ticket
  // ... (your code here)
  // Redirect or send response as needed
  // ... (your code here)
});

//Define a route to update a ticket
app.put('/rest/ticket/:id', async (req, res) => {
  try {
    const ticketId = parseInt(req.params.id);
    const updatedTicket = req.body;
    delete updated
    const tickets = client.db('Phase-ll').collection('CMPS415');
    // Use findOneAndUpdate() method to update the ticket
    const result = await tickets.findOneAndUpdate(
      { id: ticketId }, // Filter for the ticket to be updated
      { $set: updatedTicket }, // Update the ticket with the new data
      { returnOriginal: false } // Return the updated ticket
    );

    if (result.value) {
      console.log(`Updated ticket with id ${ticketId}`);
      res.send(result.value);
    } else {
      console.log(`Ticket with id ${ticketId} not found`);
      res.status(404).send(`Ticket with id ${ticketId} not found`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Define a route for deleting a ticket
app.delete('/rest/ticket/:id', async (req, res) => {
  try {
    const ticketId = parseInt(req.params.id);
    const tickets = client.db('Phase-ll').collection('CMPS415');
    // Use deleteOne() method to delete the ticket by id
    const result = await tickets.deleteOne({ id: ticketId });

    if (result.deletedCount > 0) {
      console.log(`Deleted ticket with id ${ticketId}`);
      res.send(`Deleted ticket with id ${ticketId}`);
    } else {
      console.log(`Ticket with id ${ticketId} not found`);
      res.status(404).send(`Ticket with id ${ticketId} not found`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
