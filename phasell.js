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

// // Endpoint to update a ticket by id
// app.put('/rest/ticket/:id', async (req, res) => {
//   const id = parseInt(req.params.id);
//   const update = req.body;
//   const tickets = client.db('Phase-ll').collection('CMPS415');
//   const result = await tickets.updateOne({ id: id }, { $set: update });

//   if (result.modifiedCount === 0) {
//     res.status(404).send('Ticket not found');
//   } else {
//     console.log(`Updated ticket with id ${id}`);
//     res.send('Ticket updated successfully');
//   }
// });

  // Define route handler for updating tickets
  app.put('/rest/ticket/:id', async (req, res) => {
    try {
      const ticketId = parseInt(req.params.id);
      const updatedTicket = req.body;
      const tickets = client.db('Phase-ll').collection('CMPS415');
      const result = await tickets.updateOne({ id: ticketId }, { $set: updatedTicket });
      console.log(`Updated ticket with id ${ticketId}`);
      res.send(result);
    } catch (err) {
      console.error('Failed to update ticket:', err);
      res.status(500).send('Failed to update ticket');
    }
  });





// Define a route for deleting a ticket by id
app.delete('/rest/ticket/:id', async (req, res) => {
   const ticketId = parseInt(req.params.id); // Parse id as integer
  const tickets = client.db('Phase-ll').collection('CMPS415');

  // Use deleteOne() method to delete a document by id
  const result = await tickets.deleteOne({ id: ticketId });

  if (result.deletedCount === 1) {
    console.log(`Deleted ticket with id ${ticketId}`);
    res.send(`Deleted ticket with id ${ticketId}`);
  } else {
    console.log(`Ticket with id ${ticketId} not found`);
    res.status(404).send(`Ticket with id ${ticketId} not found`);
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



