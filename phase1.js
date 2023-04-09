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

// Define endpoint for getting ticket by ID
app.get('/rest/ticket/id', (req, res) => {
  // Read the data from the file
  fs.readFile('mydata.json', 'utf8', (err, data) => {
    if (err) {
      console.error(`Failed to read data from file: ${err}`);
      res.status(500).send('Failed to read data from file');
    } else {
      // Parse the data from JSON string to an array of Ticket objects
      const tickets = JSON.parse(data);

      // Find the ticket with the specified ID
      const ticket = tickets.find((x) => x.id === Number(req.params.id));

      // If ticket is found, return it; otherwise, return an error
      return ticket
        ? res.status(200).send(JSON.stringify(ticket, null, 2))
        : res.status(404).send(`Ticket with ID ${req.params.id} not found.`);
    }
  });
});

app.post('/rest/ticket', (req, res) => {
  // Read the existing tickets from the file
  fs.readFile('mydata.json', 'utf8', (err, data) => {
    if (err) {
      console.error(`Failed to read data from file: ${err}`);
      res.status(500).send('Failed to read data from file');
    } else {
      // Parse the JSON data into an array of ticket objects
      let tickets = JSON.parse(data);

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

      // Write the updated tickets back to the file
      fs.writeFile('mydata.json', JSON.stringify(tickets), (err) => {
        if (err) {
          console.error(`Failed to write data to file: ${err}`);
          res.status(500).send('Failed to write data to file');
        } else {
          res.status(201).json(newTicket);
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



