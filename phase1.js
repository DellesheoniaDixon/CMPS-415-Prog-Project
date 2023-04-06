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


app.post('/rest/data', (req, res) => {
  const data = req.body.data;
  fs.appendFile('mydata.txt', data, 'utf8', err => {
    if (err) {
      console.error(`Failed to update file: ${err}`);
      res.status(500).send('Failed to update file');
    } else {
      res.send('File updated');
    }
  });
});

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

