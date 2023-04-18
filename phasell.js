const express = require('express');
const mongoose = require('mongoose');

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

// Define a Mongoose schema for your ticket model
const ticketSchema = new mongoose.Schema({
  id: Number,
  created_at: Date,
  updated_at: Date,
  type: String,
  subject: String,
  description: String,
  priority: String,
  status: String,
  recipient: String,
  submitter: String,
  assignee_id: Number,
  follower_ids: [Number],
  tags: [String]
});

// Create a Mongoose model for your ticket collection
const Ticket = mongoose.model('Ticket', ticketSchema);

// Endpoint to get all tickets
app.get('/rest/list', (req, res) => {
  Ticket.find({}, (err, tickets) => {
    if (err) {
      res.status(500).send('Error fetching tickets');
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
      res.status(500).send('Error fetching ticket');
    } else if (!ticket) {
      res.status(404).send('Ticket not found');
    } else {
      res.send(ticket);
    }
  });
});

// Endpoint to create a new ticket
app.post('/rest/ticket', express.json(), (req, res) => {
  const ticket = new Ticket(req.body);
  ticket.save((err) => {
    if (err) {
      res.status(500).send('Error creating ticket');
    } else {
      console.log(`Created ticket with id ${ticket.id}`);
      res.send(ticket);
    }
  });
});

// Endpoint to update an existing ticket by id
app.put('/rest/ticket/:id', express.json(), (req, res) => {
  const id = parseInt(req.params.id);
  Ticket.findOneAndUpdate({ id }, req.body, { new: true }, (err, ticket)
