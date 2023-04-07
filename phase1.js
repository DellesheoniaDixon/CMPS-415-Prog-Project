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

// app.post('/rest/ticket', (req, res) => {
//   const newData = req.body.data;
//   // Read the existing data from file
//   const fileData = fs.readFileSync('mydata.txt', 'utf8');
//   // Append the new data to the existing data
//   const updatedData = fileData + '\n' + newData;
//   // Write the updated data back to the file
//   fs.writeFileSync('mydata.txt', updatedData);
//   // Send a response to the client
//   res.send('Data updated successfully');
// });


// Route handler for POST /rest/data/:id
// app.post('/rest/data/:id', (req, res) => {
//   const id = req.params.id;
//   const newData = req.body.data;

//   // Read the data from file
//   const fileData = fs.readFileSync('mydata.txt', 'utf8');
//   // Split the data into an array of lines
//   const dataLines = fileData.split('\n');
//   // Find the index of the line with the matching ID
//   const matchingLineIndex = dataLines.findIndex(line => line.startsWith(id));
//   // If a matching line was found, update the data
//   if (matchingLineIndex >= 0) {
//     const matchingData = dataLines[matchingLineIndex].split(',')[1];
//     const updatedLine = `${id},${newData}`;
//     dataLines[matchingLineIndex] = updatedLine;
//     // Write the updated data back to file
//     fs.writeFileSync('mydata.txt', dataLines.join('\n'));
//     res.send(`Data associated with ID ${id} updated to ${newData}`);
//   } else {
//     res.status(404).send('Data not found');
//   }
// });

// app.post('/rest/ticket', (req, res) => {
//   // Read the current data from the file
//   fs.readFile('mydata.txt', 'utf8', (err, data) => {
//     if (err) {
//       console.error(err);
//       res.status(500).send('Error reading file');
//       return;
//     }

//     // Parse the data into an array of ticket objects
//     let tickets = JSON.parse(data);

//     // Add the new ticket object to the array
//     const newTicket = req.body;
//     tickets.push(newTicket);

//     // Write the updated data back to the file
//     fs.writeFile('mydata.txt', JSON.stringify(tickets), (err) => {
//       if (err) {
//         console.error(err);
//         res.status(500).send('Error writing file');
//         return;
//       }

//       res.send(`Ticket ${newTicket.id} created`);
//     });
//   });
// });

app.post('/rest/ticket', function(req, res) {
  const ticket_id = req.body.id;
  const token = req.body.token;
  const geo = req.body.geo;

  res.send({
    'ticket_id': ticket_id,
    'token': token,
    'geo': geo
  });
});


app.get('/', function(req, res) {
  const myquery = req.query;
  var ticket = 'Starting... ';
  res.send(ticket);
});


// Write to a file 

// app.get('/wfile', function(req, res) {
//   const myquery = req.query;
  
//   var ticket = '';
//   for(var key in myquery) { ticket += "--" + key + ">" + myquery[key]; }
//   fs.appendFile("mydata.txt", ticket+'\n', (err) => {
//     if (err)
//       console.log(err);
//     else {
//       console.log("File written successfully\n");
//       console.log("Contents of file now:\n");
//       console.log(fs.readFileSync("mydata.txt", "utf8"));
//     }
//   });
 
//   res.send(ticket);

// });


// Simple cascade
// app.param('name', function(req, res, next, name) {
//   const modified = name.toUpperCase();

//   req.name = modified;
//   next();
// });

