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

  // Define route handler for fetching ticket by ID
  app.get('/rest/ticket/:id', async (req, res) => {
    try {
      const ticketId = parseInt(req.params.id);
      const tickets = client.db('Phase-ll').collection('CMPS415');
      const ticket = await tickets.findOne({ id: ticketId });
      if (!ticket) {
        res.status(404).send('Ticket not found');
      } else {
        console.log(`Fetched ticket with id ${ticketId}`);
        res.send(ticket);
      }
    } catch (err) {
      console.error('Failed to fetch ticket:', err);
      res.status(500).send('Failed to fetch ticket');
    }
  });


// Define route handler for creating tickets
  app.post('/rest/ticket', async (req, res) => {
    try {
      const ticket = req.body;
      ticket.id = Date.now(); // Assign a unique id
      const tickets = client.db('Phase-ll').collection('CMPS415');
      await tickets.insertOne(ticket);
      console.log(`Created ticket with id ${ticket.id}`);
      res.send(ticket);
    } catch (err) {
      console.error('Failed to create ticket:', err);
      res.status(500).send('Failed to create ticket');
    }
  });




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


  // Define route handler for deleting ticket by ID
  app.delete('/rest/ticket/:id', async (req, res) => {
    try {
      const ticketId = parseInt(req.params.id);
      const tickets = client.db('Phase-ll').collection('CMPS415');
      const result = await tickets.deleteOne({ id: ticketId });
      if (result.deletedCount === 0) {
        res.status(404).send('Ticket not found');
      } else {
        console.log(`Deleted ticket with id ${ticketId}`);
        res.send(`Ticket with id ${ticketId} deleted`);
      }
    } catch (err) {
      console.error('Failed to delete ticket:', err);
      res.status(500).send('Failed to delete ticket');
    }
  });
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



