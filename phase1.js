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
  fs.readFile('mydata.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(`Failed to read data from file: ${err}`);
      res.status(500).send('Failed to read data from file');
    }
    else {
       console.log("File written successfully\n");
      console.log("Contents of file now:\n");
      res.send(data);
    }
  });
});

app.get('/rest/ticket/:id', (req, res) => {
  const id = req.params.id;
  
  fs.readFile('mydata.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
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
  
  // Append new ticket data to data.txt file
  fs.appendFile('data.txt', JSON.stringify(newTicket) + '\n', (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error creating new ticket');
    } else {
      res.send('New ticket created successfully');
    }
  });
});
  


app.get('/', function(req, res) {
  const myquery = req.query;
  var ticket = 'Starting... ';
  res.send(ticket);
});


