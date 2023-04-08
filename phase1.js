const express = require('express');
const bodyParser=require('body-parser');
const app = express();
const port = 3000;
var fs = require("fs");


app.listen(port);
console.log('Server started at http://localhost:' + port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Define routes
//rest makes it more specific to the 'ticket' resourse
app.get('/rest/list', (req, res) => {
  fs.readFile('mydata.json', 'utf8', (err, data) => {
    if (err) {
      console.error(`Failed to read data from file: ${err}`);
      res.status(500).send('Failed to read data from file');
    }
    else {
      console.log("File read successfully\n");
      console.log("Contents of file now:\n");
      res.send(data);
    }
  });
});




app.get('/rest/ticket/:id', (req, res) => {
  const ticket = tickets.getTicketById(req.params.id);
  if (ticket) {
    res.json(ticket);
  } else {
    res.status(404).json({ error: 'Ticket not found' });
  }
});



// Define the Ticket class
class Ticket {
  constructor(
    id,
    type,
    subject,
    description,
    priority,
    status,
    recipient,
    submitter,
    assignee_id,
    follower_ids,
    tags
  ) {
    this.id = id;
    this.type = type;
    this.subject = subject;
    this.description = description;
    this.priority = priority;
    this.status = status;
    this.recipient = recipient;
    this.submitter = submitter;
    this.assignee_id = assignee_id;
    this.follower_ids = follower_ids;
    this.tags = tags;
    this.created_at = new Date().toISOString();
    this.updated_at = new Date().toISOString();
  }
}

// In-memory array to store tickets
let tickets = [];

// Endpoint to create a new ticket
app.post('/rest/ticket', (req, res) => {
  // Generate a new ID for the ticket
  const newId = tickets.length + 1;

  // Create a new ticket object from the request body
  const newTicket = new Ticket(
    newId,
    req.body.type,
    req.body.subject,
    req.body.description,
    req.body.priority,
    req.body.status,
    req.body.recipient,
    req.body.submitter,
    req.body.assignee_id,
    req.body.follower_ids || [],
    req.body.tags || []
  );

  // Add the new ticket to the array
  tickets.push(newTicket);

  // Return the new ticket object as JSON
  res.json(newTicket);
});

app.get('/', function(req, res) {
  const myquery = req.query;
  var ticket = 'Starting... ';
  res.send(ticket);
});


