const express = require('express');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

let tickets = [];

// Read data from mydata.json
fs.readFile('mydata.json', (err, data) => {
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
  console.log(`Created ticket with id ${ticket.id}`);

  // Write updated data back to mydata.json
  fs.writeFile('mydata.json', JSON.stringify(tickets), (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Data written to file');
    }
  });

  res.send(ticket);
});

// Endpoint to delete a ticket by id
app.delete('/rest/ticket/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tickets.findIndex((t) => t.id === id);

  if (index === -1) {
    res.status(404).send('Ticket not found');
  } else {
    tickets.splice(index, 1);
    console.log(`Deleted ticket with id ${id}`);

    // Write updated data back to mydata.json
    fs.writeFile('mydata.json', JSON.stringify(tickets), (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Data written to file');
      }
    });

    res.send(`Deleted ticket with id ${id}`);
  }
});

// Endpoint to update a ticket by id
app.put('/rest/ticket/:id', express.json(), (req, res) => {
  const id = parseInt(req.params.id);
  const index = tickets.findIndex((t) => t.id === id);

  if (index === -1) {
    res.status(404).send('Ticket not found');
  } else {
    const updatedTicket = req.body;
    updatedTicket.id = id;
    tickets[index] = updatedTicket;
    console.log(`Updated ticket with id ${id}`);

    // Write updated data back to mydata.json
    fs.writeFile('mydata.json', JSON.stringify(tickets), (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Data written to file');
      }
    });

    res.send(updatedTicket);
  }
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



