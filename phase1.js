const express = require('express');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

let tickets = [];

// Load initial tickets from mydata.json
fs.readFile('mydata.json', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
  } else {
    tickets = JSON.parse(data);
  }
});

// Endpoint to get all tickets
app.get('/rest/list', (req, res) => {
  res.send(tickets);
});

// Endpoint to get a single ticket by id
app.get('/rest/ticket/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const ticket = tickets.find((t) => t.id === id);

  if (!ticket) {
    res.status(404).send('Ticket not found');
  } else {
    res.send(ticket);
  }
});

// Endpoint to create a new ticket
app.post('/rest/ticket', express.json(), (req, res) => {
  const ticket = req.body;
  ticket.id = Date.now(); // Assign a unique id
  tickets.push(ticket);

  res.send(ticket);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// app.get('/', function(req, res) {
//   const myquery = req.query;
//   var ticket = 'Starting... ';
//   res.send(ticket);
// });



