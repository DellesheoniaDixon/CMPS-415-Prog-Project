const express = require('express');
const bodyParser=require('body-parser');
const app = express();
const port = 3000;
var fs = require("fs");

app.listen(port);
console.log('Server started at http://localhost:' + port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes
//rest makes it more specific to the 'ticket' resourse

app.get('/rest/list/', (req, res) => {
  fs.readFile('mydata.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(`Failed to read data from file: ${err}`);
      res.status(500).send('Failed to read data from file');
    } else {
      res.send(data);
    }
  });
});

app.get('/rest/ticket/id', (req, res) => {
  fs.readFile('mydata.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(`Failed to read data from file: ${err}`);
      res.status(500).send('Failed to read data from file');
    } else {
      res.send(data);
    }
  });
});



app.post('/rest/ticket/', async (req, res) => {
  const ticket = new Ticket(req.body);
  await ticket.save();
  res.json(ticket);
});


// app.post('/rest/ticket/create', (req, res) => {
//   const data = req.body.data;
//   fs.writeFile('mydata.txt', data, 'utf8', err => {
//     if (err) {
//       console.error(`Failed to write data to file: ${err}`);
//       res.status(500).send('Failed to write data to file');
//     } else {
//       res.send('Data written to file');
//     }
//   });
// });



// app.put('/rest/ticket/update', (req, res) => {
//   const ticket = tickets.find(t => t.id == req.params.id);
//   if (!ticket) {
//     res.sendStatus(404);
//   } else {
//     ticket.created = req.body.created;
//     ticket.updated = req.body.updated;
//     ticket.type = req.body.type;
//     ticket.subject = req.body.subject;
//     ticket.description = req.body.description;
//     ticket.priority = req.body.priority;
//     ticket.status = req.body.status;
//     ticket.recipient = req.body.recipient;
//     ticket.submitter = req.body.submitter;
//     ticket.assigneeid = req.body.assigneeid;
//     ticket.followerids = req.body.followerids;
//     ticket.tags = req.body.tags;
//     saveTickets();
//     res.json(ticket);
//   }
// });

// app.put('/rest/tickets/:id', async (req, res) => {
//   const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
//   res.json(ticket);
// });

// app.delete('/rest/tickets/', async (req, res) => {
//   await Ticket.findByIdAndDelete(req.params.id);
//   res.sendStatus(204);
// });

app.get('/', function(req, res) {
  const myquery = req.query;
  var ticket = 'Starting... ';
  res.send(ticket);
});


// Write to a file 

app.get('/wfile', function(req, res) {
  const myquery = req.query;
  
  var ticket = '';
  for(var key in myquery) { ticket += "--" + key + ">" + myquery[key]; }
  fs.appendFile("mydata.txt", ticket+'\n', (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully\n");
      console.log("Contents of file now:\n");
      console.log(fs.readFileSync("mydata.txt", "utf8"));
    }
  });
 
  res.send(ticket);

});


// Simple cascade
// app.param('name', function(req, res, next, name) {
//   const modified = name.toUpperCase();

//   req.name = modified;
//   next();
// });

