// Import dependencies
const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://dellesheoniadixon2:k9UyT796OyDNGNlB@ddixonmdb.05vfedo.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
});


// Define Ticket schema
const ticketSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
  type: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, required: true },
  status: { type: String, required: true },
  recipient: { type: String, required: true },
  submitter: { type: String, required: true },
  assignee_id: { type: Number, required: true },
  follower_ids: { type: [Number], required: true },
  tags: { type: [String], required: true }
});

// Create Ticket model
const Ticket = mongoose.model('Ticket', ticketSchema);

// Middleware for parsing request body as JSON
app.use(bodyParser.json());

// Endpoint to get all tickets
app.get('/rest/list', (req, res) => {
  Ticket.find({}, (err, tickets) => {
    if (err) {
      res.status(500).send('Error retrieving tickets');
    } else {
      res.send(tickets);
    }
  });
});

// Endpoint to get a single ticket by id
app.get('/rest/ticket/:id', (req, res) => {
  const id = parseInt(req.params.id);
  Ticket.findOne({ id }, (err, ticket) => {
    if (err) {
      res.status(500).send('Error retrieving ticket');
    } else if (!ticket) {
      res.status(404).send('Ticket not found');
    } else {
      res.send(ticket);
    }
  });
});

// Endpoint to create a new ticket
app.post('/rest/ticket', (req, res) => {
  const ticket = new Ticket(req.body);
  ticket.save((err, savedTicket) => {
    if (err) {
      res.status(500).send('Error creating ticket');
    } else {
      console.log(`Created ticket with id ${savedTicket.id}`);
      res.send(savedTicket);
    }
  });
});

// Endpoint to update a ticket by id
app.put('/rest/ticket/:id', (req, res) => {
  const id = parseInt(req.params.id);
  Ticket.findOneAndUpdate({ id }, req.body, { new: true }, (err, ticket) => {
    if (err) {
      res.status(500).send('Error updating ticket');
    } else if (!ticket) {
      res.status(404).send('Ticket not found');
    } else {
      console.log(`Updated ticket with id ${id}`);
      res.send(ticket);
    }
  });
});

// Endpoint to delete a ticket by id
app.delete('/rest/ticket/:id', (req, res) => {
  const id = parseInt(req.params.id);
  Ticket.findOneAndUpdate({ id }, { status: 'deleted' }, { new: true }, (err, ticket) => {
    if (err) {
      res.status(500).send('Error deleting ticket');
    } else if (!ticket) {
      res.status(404).send('Ticket not found');
    } else {
      console.log(`Deleted ticket with id ${id}`);
      res.send(ticket);
    }
  });
});


// Start the server
app.listen(PORT, () => {
console.log(Server running on port ${PORT});
});

