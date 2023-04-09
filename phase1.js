// const express = require('express');
// const bodyParser=require('body-parser');
// const app = express();
// const port = 3000;
// var fs = require("fs");


// app.listen(port);
// console.log('Server started at http://localhost:' + port);

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// // Define routes
// //rest makes it more specific to the 'ticket' resourse
// app.get('/rest/list', (req, res) => {
//   fs.readFile('mydata.json', 'utf8', (err, data) => {
//     if (err) {
//       console.error(`Failed to read data from file: ${err}`);
//       res.status(500).send('Failed to read data from file');
//     }
//     else {
//       console.log("File read successfully\n");
//       console.log("Contents of file now:\n");
//       res.send(data);
//     }
//   });
// });


// app.get('/rest/ticket/:id', (req, res) => {
//   const id = req.params.id;

//   fs.readFile('mydata.json', 'utf8', (err, data) => {
//     if (err) {
//       console.error(err);
//     }
//   });
// });
// // Route handler for POST requests to /rest/tickets
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
  
//   // Append new ticket data to data.txt file
//   fs.appendFile('mydata.json', JSON.stringify(newTicket) + '\n', (err) => {
//     if (err) {
//       console.error(err);
//       res.status(500).send('Error creating new ticket');
//     } else {
//       res.send('New ticket created successfully');
//     }
//   });
// });

// app.get('/', function(req, res) {
//   const myquery = req.query;
//   var ticket = 'Starting... ';
//   res.send(ticket);
// });


// --- This is the standard stuff to get it to work on the browser
const express = require('express');
const bodyParser = require('body-parser');
var fs = require('fs');
const { send } = require('process');
const app = express();
const port = 3000;
app.listen(port);
console.log('Server started at http://localhost:' + port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// routes will go here

// Default route:
app.get('/', function(req, res) {
  const myquery = req.query;
  var outstring = 'Starting... ';
  res.send(outstring);
});



app.get('/rest/list/', function(req,res){

    fs.readFile("./tickets.json", 'utf8', (err,jsonString) => {
        if (err){
            console.error(err);
          return;
        }
        try{
          const tickets = JSON.parse(jsonString);
            console.log("File read successfully!");
            console.log("Contents of file now: ");
            res.json(tickets);
        }
        catch (err) {
          console.error(err);
        }
    });
  });
app.get('/rest/ticket/:id', function(req,res){
 const id = parseInt(req.params.id);
    console.log('Looking for: ' + id);
  
     fs.readFile("./tickets.json", 'utf8', (err,jsonString) => {
        if (err){
            console.error(err);
          return;
        }
          try{
            const tickets = JSON.parse(jsonString);
            const ticket = tickets.find(t => t.id === id);
            if (ticket){
              console.log(`Ticket with ID ${id} found!`);
              res.json(ticket);
            }
            else{
            console.log(`Ticket with ID ${id} not found!`);
            res.status(404);
            }
          }
          catch(err){
            console.error(err);
          }
       });
  });
app.post('/rest/ticket/', function(req,res){
   const data = req.body;
   fs.readFile("./tickets.json", 'utf8', (err,jsonString) => {
    if (err){
        console.error(err);
      return;
    }
    try{
      const currentdata = JSON.parse(jsonString);
      currentdata.push(data);
    
    fs.writeFile("./tickets.json", JSON.stringify(currentdata, null, 2), (err) => {
        if (err){
            console.error(err);
            res.status(500);
        }
        else{
            console.log("File written successfully.");
            res.status(200).json(data);
        }
    });
  }
  catch(err){
    console.error(err);
    res.status(500).send("Error parsing JSON data!");
  }
});
});


