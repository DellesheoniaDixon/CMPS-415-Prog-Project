const express = require('express');
const fetch = require('node-fetch');
const js2xmlparser = require('js2xmlparser');
const bodyParser = require('express-xml-bodyparser');
const request = require('request');
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Connection URL and database name
const uri = 'mongodb+srv://dellesheoniadixon2:k9UyT796OyDNGNlB@ddixonmdb.05vfedo.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true });

// Connect to MongoDB
async function connect() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }
}
connect();

// Middleware to parse request body as JSON
app.use(bodyParser.json());

// Middleware for parsing XML data
app.use(express.text({ type: 'application/xml' }));

// Serve static files from the "public" directory
app.use(express.static('public'));



// Route to serve the HTML form for adding a new ticket
app.get('/postform', (req, res) => {
  fs.readFile('./post.html', 'utf8', (err, data) => {
    if (err) {
      console.error('Failed to read file:', err);
      res.status(500).send('Failed to read file');
    } else {
      res.send(data);
    }
  });
});

app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    fs.readFile('./menu.html', 'utf8', (err, contents) => {
      if(err) {
          console.log('Form file Read Error', err);
          res.write("<p>Form file Read Error");
      } else {
          console.log('Form loaded\n');
          res.write(contents + "<br>");
      }
      res.end;
    });
});

app.get('/putform', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    fs.readFile('./put.html', 'utf8', (err, contents) => {
      if(err) {
          console.log('Form file Read Error', err);
          res.write("<p>Form file Read Error");
      } else {
          console.log('Form loaded\n');
          res.write(contents + "<br>");
      }
      res.end();
    });
  });

// Define a route for retrieving a ticket by id as an XML document
app.get('/xml/ticket/:id', async (req, res) => {
  try {
    const ticketId = req.params.id;

    // Call the existing /rest/ticket/id endpoint to get ticket information as JSON
    const response = await fetch(`http://localhost:${PORT}/rest/ticket/${ticketId}`);
    const ticket = await response.json();

    // Convert ticket information from JSON to XML
    const xml = js2xmlparser.parse('ticket', ticket);

    // Set response header to indicate XML content
    res.set('Content-Type', 'application/xml');

    // Send the XML document as response
    res.send(xml);
  } catch (error) {
    // Handle errors
    res.status(500).send('Internal Server Error');
  }
});

// Define PUT - /xml/ticket/:id endpoint
app.put('/xml/ticket/:id', bodyParser({type: 'application/xml'}), async (req, res) => {
  try {
    const json = req.body;
    const ticketId = req.params.id;

    // Make request to /rest/ticket/:id endpoint with ticket information in JSON format
    request.put({
      url: `http://localhost:${PORT}/rest/ticket/${ticketId}`,
      json: json
    }, (error, response, body) => {
      if (error) {
        console.error(error);
        res.status(500).send(error.message);
      } else {
        res.send(body);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});


// Endpoint to get all tickets
app.get('/rest/list', async (req, res) => {
  const tickets = client.db('Phase-ll').collection('CMPS415');
  const result = await tickets.find().toArray();
  res.send(result);
});
// Define a route for retrieving a ticket by id
app.get('/rest/ticket/:id', async (req, res) => {
  const ticketId = parseFloat(req.params.id); // Parse id as double
  const tickets = client.db('Phase-ll').collection('CMPS415');

  // Use findOne() method to find a document by id
  const ticket = await tickets.findOne({ id: ticketId });

  if (ticket) {
    console.log(`Retrieved ticket with id ${ticketId}`);
    res.send(ticket);
  } else {
    console.log(`Ticket with id ${ticketId} not found`);
    res.status(404).send(`Ticket with id ${ticketId} not found`);
  }
});



// // Define a route for creating a new ticket
app.post('/rest/ticket', async (req, res) => {
  // Confirm that req.body.body is an object
  if (typeof req.body.body === 'object' && !Array.isArray(req.body.body)) {
    const { type, subject, description, priority, status, recipient, submitter, assignee_id, followers_ids } = req.body.body;

    // Check if required fields are present and not null
    if (type && subject && description && priority && status && recipient && submitter && assignee_id && followers_ids) {
      const ticket = {
        id: Date.now(), // Assign a unique id
        created_at: new Date(), // Set created_at field
        updated_at: new Date(), // Set updated_at field
        type, // Set type field
        subject, // Set subject field
        description, // Set description field
        priority, // Set priority field
        status, // Set status field
        recipient, // Set recipient field
        submitter, // Set submitter field
        assignee_id, // Set assignee_id field
        followers_ids, // Set followers_ids field
      };

      // Confirm that ticket is an object
      if (typeof ticket === 'object' && !Array.isArray(ticket)) {
        const tickets = client.db('Phase-ll').collection('CMPS415');
        await tickets.insertOne(ticket);
        console.log(`Created ticket with id ${ticket.id}`);

        // Create a response object with all the fields from the ticket object
        const response = { ...ticket };

        res.send(response);
      } else {
        console.log('Ticket data is not a valid object');
        res.status(400).send('Ticket data is not a valid object');
      }
    } else {
      console.log('Required fields are missing in the request body');
      res.status(400).send('Required fields are missing in the request body');
    }
  } else {
    console.log('Request body is not a valid object');
    res.status(400).send('Request body is not a valid object');
  }
}); 




//Define a route to update a ticket
app.put('/rest/ticket/:id', async (req, res) => {
  try {
    const ticketId = parseInt(req.params.id);
    const updatedTicket = req.body;
    delete updatedTicket._id; // Remove _id field from updated ticket data
    const tickets = client.db('Phase-ll').collection('CMPS415');
    const result = await tickets.updateOne({ id: ticketId }, { $set: updatedTicket });
    console.log(`Updated ticket with id ${ticketId}`);
    res.send(result);
  } catch (err) {
    console.error('Failed to update ticket:', err);
    res.status(500).send('Failed to update ticket');
  }
});

// Define a route for deleting a ticket by id
app.delete('/rest/ticket/:id', async (req, res) => {
   const ticketId = parseInt(req.params.id); // Parse id as integer
  const tickets = client.db('Phase-ll').collection('CMPS415');

  // Use deleteOne() method to delete a document by id
  const result = await tickets.deleteOne({ id: ticketId });

  if (result.deletedCount === 1) {
    console.log(`Deleted ticket with id ${ticketId}`);
    res.send(`Deleted ticket with id ${ticketId}`);
  } else {
    console.log(`Ticket with id ${ticketId} not found`);
    res.status(404).send(`Ticket with id ${ticketId} not found`);
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
