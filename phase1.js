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

app.get('/rest/ticket/:id', (req, res) => {
  const id = req.params.id;
  
  fs.readFile('mydata.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(`Failed to read data from file: ${err}`);
      res.status(500).send('Failed to read data from file');
    } else {
      const tickets = JSON.parse(data);
      const ticket = tickets.find(t => t.id === id);
      if (ticket) {
        res.send(ticket);
      } else {
        res.status(404).send(`Ticket with ID ${id} not found`);
      }
    }
  });
});



app.post('/rest/ticket', (req, res) => {
  // Generate new ID for ticket
  const newId = Date.now().toString();
  
  // Construct new ticket object
  const newTicket = {
    id: newId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    type: req.body.type,
    subject: req.body.subject,
    description: req.body.description,
    priority: req.body.priority,
    status: req.body.status,
    recipient: req.body.recipient,
    submitter: req.body.submitter,
    assignee_id: req.body.assignee_id,
    follower_ids: req.body.follower_ids || [],
    tags: req.body.tags || []
  };
  
  // Read current ticket data
  fs.readFile('mydata.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(`Failed to read data from file: ${err}`);
      res.status(500).send('Failed to read data from file');
    } else {
      let tickets = [];
      if (data) {
        tickets = JSON.parse(data);
      }
      // Add new ticket to list of tickets
      tickets.push(newTicket);
      
      // Write updated ticket data to file
      fs.writeFile('mydata.txt', JSON.stringify(tickets), 'utf8', err => {
        if (err) {
          console.error(`Failed to write data to file: ${err}`);
          res.status(500).send('Failed to write data to file');
        } else {
          res.send(newTicket);
        }
      });
    }
  });
});



app.get('/', function(req, res) {
  const myquery = req.query;
  var ticket = 'Starting... ';
  res.send(ticket);
});


