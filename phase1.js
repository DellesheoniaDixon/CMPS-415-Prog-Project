const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const fs = require("fs");

app.listen(port);
console.log('Server started at http://localhost:' + port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/rest/list', (req, res) => {
  fs.readFile('mydata.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(`Failed to read data from file: ${err}`);
      res.status(500).send('Failed to read data from file');
    } else {
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
    }
  });
});

app.post('/rest/ticket/', function(req, res) {
  res.send('CREATE a new ticket');
  const id = req.body.id;
  const creation = req.body.creation;
  const updated = req.body.updated;
  const type = req.body.type;
  const subject = req.body.subject;
  const description = req.body.description;
  const priority = req.body.priority;
  const status = req.body.state;
  const recipient = req.body.recipient;
  const submitter = req.body.submitter;
  const assignee_id = req.body.assignee_id;
  const followers_ids = req.body.followers_ids;
  const tags = req.body.tags;

  const data = {
    'id': id,
    'creation': creation,
    'updated': updated,
    'type': type,
    'subject': subject,
    'description': description,
    'priority': priority,
    'status': status,
    'recipient': recipient,
    'submitter': submitter,
    'assignee_id': assignee_id,
    'followers_ids': followers_ids,
    'tags': tags,
  };

  const JSONdata = JSON.stringify(data);

  fs.writeFile("tickets.txt", JSONdata, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("File written successfully\n");
    }
  });
});

app.get('/', function(req, res) {
  const myquery = req.query;
  var ticket = 'Starting... ';
  res.send(ticket);
});


