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
// app.get('/rest/tickets', async (req, res) => {
//   const tickets = await Ticket.find();
//   //const myquery = req.query;
//   var outstring = 'Starting... ';
//   res.send(outstring);
//   //res.json(tickets);
// });
// app.get('/rest/ticket', (req, res) => {
//   res.json(tickets);
// });


// app.post('/rest/tickets', async (req, res) => {
//   const ticket = new Ticket(req.body);
//   const user_id = req.body.id;
//   const token = req.body.token;
//   await ticket.save();
// });
app.post('/rest/data', (req, res) => {
  const data = req.body.data;
  fs.writeFile('mydata.txt', data, 'utf8', err => {
    if (err) {
      console.error(`Failed to write data to file: ${err}`);
      res.status(500).send('Failed to write data to file');
    } else {
      res.send('Data written to file');
    }
  });
});

// app.post('/rest/ticket', (req, res) => {
//   const ticket = req.body;
//   ticket.id = tickets.length + 1;
//   tickets.push(ticket);
//   saveTickets();
//   res.json(ticket);
// });


// app.get('/rest/tickets/:id', async (req, res) => {
//   const ticket = await Ticket.findById(req.params.id);
//   res.json(ticket);
// });

// app.put('/rest/tickets/:id', async (req, res) => {
//   const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
//   res.json(ticket);
// });
app.get('/rest/data', (req, res) => {
  fs.readFile('mydata.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(`Failed to read data from file: ${err}`);
      res.status(500).send('Failed to read data from file');
    } else {
      res.send(data);
    }
  });
});

// app.get('/rest/ticket/:id', (req, res) => {
//   const ticket = tickets.find(t => t.id == req.params.id);
//   if (!ticket) {
//     res.sendStatus(404);
//   } else {
//     res.json(ticket);
//   }
// });

app.put('/rest/data/id', (req, res) => {
  const data = req.body.data;
  fs.writeFile('mydata.txt', data, 'utf8', err => {
    if (err) {
      console.error(`Failed to write data to file: ${err}`);
      res.status(500).send('Failed to write data to file');
    } else {
      res.send('Data updated in file');
    }
  });
});

// app.put('/rest/ticket/:id', (req, res) => {
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

// app.delete('/rest/tickets/:id', async (req, res) => {
//   await Ticket.findByIdAndDelete(req.params.id);
//   res.sendStatus(204);
// });

app.delete('/rest/data/id', (req, res) => {
  fs.unlink('mydata.txt', err => {
    if (err) {
      console.error(`Failed to delete file: ${err}`);
      res.status(500).send('Failed to delete file');
    } else {
      res.send('File deleted');
    }
  });
});


// app.delete('/rest/ticket/:id', (req, res) => {
//   const index = tickets.findIndex(t => t.id == req.params.id);
//   if (index === -1) {
//     res.sendStatus(404);
//   } else {
//     tickets.splice(index, 1);
//     saveTickets();
//     res.sendStatus(204);
//   }
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
app.param('name', function(req, res, next, name) {
  const modified = name.toUpperCase();

  req.name = modified;
  next();
});

