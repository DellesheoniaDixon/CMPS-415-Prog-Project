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
  // Read the data from file
  const fileData = fs.readFileSync('mydata.txt', 'utf8');
  // Split the data into an array of lines
  const dataLines = fileData.split('\n');
  // Find the line with the matching ID
  const matchingLine = dataLines.find(line => line.startsWith(id));
  // If a matching line was found, return the data
  if (matchingLine) {
    const matchingData = matchingLine.split(',')[1];
    res.send(matchingData);
  } else {
    res.status(404).send('Data not found');
  }
});



app.post('/rest/ticket', (req, res) => {
  // Read the existing data from the file
  const fileData = fs.readFileSync('mydata.txt');
  const data = JSON.parse(fileData);
  
  // Generate a new ID for the ticket
  const newId = data.length > 0 ? data[data.length - 1].id + 1 : 1;
  
  // Create a new ticket object with the request data and generated ID
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
  
  // Add the new ticket to the data array
  data.push(newTicket);
  
  // Write the updated data back to the file
  fs.writeFileSync('mydata.txt', JSON.stringify(data, null, 2));
  
  // Send the new ticket object in the response
  res.json(newTicket);
});

app.get('/', function(req, res) {
  const myquery = req.query;
  var ticket = 'Starting... ';
  res.send(ticket);
});
app.post('/', function(req, res) {
  const myquery = req.query;
  var ticket = 'Starting... ';
  res.send(ticket);
});



