const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

const FILE_PATH = './mydata.json';

// Middleware to parse JSON data
app.use(express.json());

// GET all items
app.get('/rest/tickets', (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE_PATH));
  res.send(data);
});

// GET item by ID
app.get('/rest/tickets/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const data = JSON.parse(fs.readFileSync(FILE_PATH));
  const item = data.find((i) => i.id === id);

  if (!item) {
    res.status(404).send('Item not found');
  } else {
    res.send(item);
  }
});

// POST a new item
app.post('/rest/tickets', (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE_PATH));
  const newItem = req.body;
  newItem.id = data.length + 1;
  data.push(newItem);
  fs.writeFileSync(FILE_PATH, JSON.stringify(data));
  res.send(newItem);
});

// PUT (update) an existing item by ID
app.put('/rest/tickets/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const data = JSON.parse(fs.readFileSync(FILE_PATH));
  const index = data.findIndex((i) => i.id === id);

  if (index === -1) {
    res.status(404).send('Item not found');
  } else {
    const updatedItem = req.body;
    updatedItem.id = id;
    data[index] = updatedItem;
    fs.writeFileSync(FILE_PATH, JSON.stringify(data));
    res.send(updatedItem);
  }
});

// DELETE an item by ID
app.delete('/rest/tickets/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const data = JSON.parse(fs.readFileSync(FILE_PATH));
  const index = data.findIndex((i) => i.id === id);

  if (index === -1) {
    res.status(404).send('Item not found');
  } else {
    const deletedItem = data.splice(index, 1)[0];
    fs.writeFileSync(FILE_PATH, JSON.stringify(data));
    res.send(deletedItem);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


// app.get('/', function(req, res) {
//   const myquery = req.query;
//   var ticket = 'Starting... ';
//   res.send(ticket);
// });



