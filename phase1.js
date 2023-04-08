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

app.get('/rest/ticket/:id', function(req, res) {
  const searchKey = "{ id: '" + req.params.id + "'}";
  console.log("Looking for: " + searchKey); 
});



app.post('/post/ticket', function(req, res) {
  const id = req.body.id;
  const created_at = new Date().toISOString();
  const updated_at = new Date().toISOString();
  const type = req.body.type;
  const subject = req.body.subject;
  const description = req.body.description;
  const priority = req.body.priority;
  const status = req.body.status;
  const recipient = req.body.recipient;
  const submitter = req.body.submitter;
  const assignee_id = req.body.assignee_id;
  const follower_ids = req.body.follower_ids || [];
  const tags = req.body.tags || [];

  res.send({
    'id': id,
    'created_at': created_at,
    'updated_at': updated_at,
    'type': type,
    'subject': subject,
    'description': description,
    'priority': priority,
    'status': status,
    'recipient': recipient,
    'submitter': submitter,
    'assignee_id': assignee_id,
    'follower_ids': follower_ids,
    'tags': tags
  });
});

// app.post('/rest/ticket', (req, res) => {
//   // Generate new ID for ticket
//   const newId = Date.now().toString();
  
//   // Construct new ticket object
//   const newTicket = {
//     id: newId,
//     created_at: new Date().toISOString(),
//     updated_at: new Date().toISOString(),
//     type: req.body.type,
//     subject: req.body.subject,
//     description: req.body.description,
//     priority: req.body.priority,
//     status: req.body.status,
//     recipient: req.body.recipient,
//     submitter: req.body.submitter,
//     assignee_id: req.body.assignee_id,
//     follower_ids: req.body.follower_ids || [],
//     tags: req.body.tags || []
//   };
  
//   // Read current ticket data
//   fs.readFile('mydata.txt', 'utf8', (err, data) => {
//     if (err) {
//       console.error(`Failed to read data from file: ${err}`);
//       res.status(500).send('Failed to read data from file');
//     } else {
//       let tickets = [];
//       if (data) {
//         tickets = JSON.parse(data);
//       }
//       // Add new ticket to list of tickets
//       tickets.push(newTicket);
      
//       // Write updated ticket data to file
//       fs.writeFile('mydata.txt', JSON.stringify(tickets), 'utf8', err => {
//         if (err) {
//           console.error(`Failed to write data to file: ${err}`);
//           res.status(500).send('Failed to write data to file');
//         } else {
//           res.send(newTicket);
//         }
//       });
//     }
//   });
// });



app.get('/', function(req, res) {
  const myquery = req.query;
  var ticket = 'Starting... ';
  res.send(ticket);
});


