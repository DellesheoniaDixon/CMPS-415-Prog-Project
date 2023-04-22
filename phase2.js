const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb+srv://dellesheoniadixon2:k9UyT796OyDNGNlB@ddixonmdb.05vfedo.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'Phase-ll';

app.listen(port);
console.log('Server started at port:' + port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------
// Routes for the app
// ---------------------

app.get('/', function (req, res) {
  const myquery = req.query;
  var outstring = 'Started and listening... ';
  res.send(outstring);
});

// Show the form for POSTing input
app.get('/form', function (req, res) {
  res.setHeader('Content-Type', 'text/html');
  fs.readFile('./post.html', 'utf8', (err, contents) => {
    if (err) {
      console.log('Form file Read Error', err);
      res.write("<p>Form file Read Error");
    } else {
      console.log('Form loaded\n');
      res.write(contents + "<br>");
    }
    res.end();
  });
});

// List all tickets (which are stored in MongoDB)
app.get('/rest/list', function (req, res) {
  MongoClient.connect(url, function (err, client) {
    if (err) throw err;
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    const ticketsCollection = db.collection('tickets');
    ticketsCollection.find({}).toArray(function (err, tickets) {
      if (err) throw err;
      console.log('Tickets loaded\n');
      res.write(JSON.stringify(tickets) + "<br>");
      res.end();
      client.close();
    });
  });
});

// Search for a specific ticket (id) in MongoDB
app.get('/rest/ticket/:id', function (req, res) {
  const inputId = Number(req.params.id);
  console.log("Looking for: " + inputId);

  MongoClient.connect(url, function (err, client) {
    if (err) throw err;
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    const ticketsCollection = db.collection('tickets');
    ticketsCollection.findOne({ id: inputId }, function (err, ticket) {
      if (err) throw err;
      if (!ticket) {
        res.status(404).send("Ticket does not exist!");
      } else {
        console.log("Ticket exists!")
        res.json(ticket);
      }
      client.close();
    });
  });
});

// A POST request to insert a new record in MongoDB
app.post('/rest/maketicket', function (req, res) {
  const newTicket = req.body;
  // Report to console what was received (for debugging)
  console.log(newTicket);

  MongoClient.connect(url, function (err, client) {
    if (err) throw err;
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    const ticketsCollection = db.collection('tickets');
    ticketsCollection.insertOne(newTicket, function (err, result) {
      if (err) {
        return res.status(500).json({
          error: "Error writing to MongoDB!"
        });
      } else {
        console.log("Ticket added!")
        res.status(201).json(newTicket);
      }
      client.close();
    });
  });
});

// A PUT request to update a specific ticket (id) in MongoDB
app.put('/rest/ticket/:id', function (req, res) {
  const inputId = Number(req.params.id);
  const updatedTicket = req.body;
  console.log("Updating ticket with ID: " + inputId);
  console.log(updatedTicket);

  MongoClient.connect(url, function (err, client) {
    if (err) throw err;
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    const ticketsCollection = db.collection('tickets');

    ticketsCollection.findOneAndUpdate({ id: inputId }, { $set: updatedTicket }, { returnOriginal: false }, function (err, ticket) {
      if (err) {
        return res.status(500).json({
          error: "Error updating ticket in MongoDB!"
        });
      } else {
        if (!ticket.value) {
          res.status(404).send("Ticket does not exist!");
        } else {
          console.log("Ticket updated!")
          res.status(200).json(ticket.value);
        }
      }
      client.close();
    });
  });
});

app.delete('/rest/ticket/:id', function (req, res) {
  const inputId = Number(req.params.id);
  console.log("Deleting ticket with ID: " + inputId);

  MongoClient.connect(url, function (err, client) {
    if (err) throw err;
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    const ticketsCollection = db.collection('tickets');

    ticketsCollection.findOneAndDelete({ id: inputId }, function (err, ticket) {
      if (err) {
        return res.status(500).json({
          error: "Error deleting ticket from MongoDB!"
        });
      } else {
        if (!ticket.value) {
          res.status(404).send("Ticket does not exist!");
        } else {
          console.log("Ticket deleted!")
          res.status(204).send();
        }
      }
      client.close();
    });
  });
});



