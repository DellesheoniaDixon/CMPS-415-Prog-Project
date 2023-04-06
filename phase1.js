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
app.get('/rest/tickets', async (req, res) => {
  const tickets = await Ticket.find();
  //const myquery = req.query;
  var outstring = 'Starting... ';
  res.send(outstring);
  //res.json(tickets);
});

app.post('/rest/tickets', async (req, res) => {
  const ticket = new Ticket(req.body);
  await ticket.save();
  res.json(ticket);
});

app.get('/rest/tickets/:id', async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  res.json(ticket);
});

app.put('/rest/tickets/:id', async (req, res) => {
  const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(ticket);
});

app.delete('/rest/tickets/:id', async (req, res) => {
  await Ticket.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});


app.get('/', function(req, res) {
  const myquery = req.query;
  var outstring = 'Starting... ';
  res.send(outstring);
});


// Write to a file 

app.get('/wfile', function(req, res) {
  const myquery = req.query;
  
  var outstring = '';
  for(var key in myquery) { outstring += "--" + key + ">" + myquery[key]; }
  fs.appendFile("mydata.txt", outstring+'\n', (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully\n");
      console.log("Contents of file now:\n");
      console.log(fs.readFileSync("mydata.txt", "utf8"));
    }
  });
 
  res.send(outstring);

});


// Simple cascade
app.param('name', function(req, res, next, name) {
  const modified = name.toUpperCase();

  req.name = modified;
  next();
});

