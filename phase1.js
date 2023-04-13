const express = require('express');
const fs = require('fs/promises');

const app = express();
const port = 3000;

const FILE_PATH = './mydata.json';

// Middleware to parse JSON data
app.use(express.json());

// GET all items
app.get('/rest/tickets', async (req, res) => {
  try {
    const data = await fs.readFile(FILE_PATH, 'utf-8');
    res.send(JSON.parse(data));
  } catch (err) {
    res.status(500).send('Internal server error');
  }
});

// GET item by ID
app.get('/rest/tickets/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = await fs.readFile(FILE_PATH, 'utf-8');
    const items = JSON.parse(data);
    const item = items.find((i) => i.id === id);

    if (!item) {
      res.status(404).send('Item not found');
    } else {
      res.send(item);
    }
  } catch (err) {
    res.status(500).send('Internal server error');
  }
});

// POST a new item
app.post('/rest/tickets', async (req, res) => {
  try {
    const data = await fs.readFile(FILE_PATH, 'utf-8');
    const items = JSON.parse(data);
    const newItem = req.body;
    newItem.id = items.length + 1;
    items.push(newItem);
    await fs.writeFile(FILE_PATH, JSON.stringify(items));
    res.send(newItem);
  } catch (err) {
    res.status(500).send('Internal server error');
  }
});

// PUT (update) an existing item by ID
app.put('/rest/tickets/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = await fs.readFile(FILE_PATH, 'utf-8');
    const items = JSON.parse(data);
    const index = items.findIndex((i) => i.id === id);

    if (index === -1) {
      res.status(404).send('Item not found');
    } else {
      const updatedItem = req.body;
      updatedItem.id = id;
      items[index] = updatedItem;
      await fs.writeFile(FILE_PATH, JSON.stringify(items));
      res.send(updatedItem);
    }
  } catch (err) {
    res.status(500).send('Internal server error');
  }
});

// DELETE an item by ID
app.delete('/rest/tickets/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = await fs.readFile(FILE_PATH, 'utf-8');
    const items = JSON.parse(data);
    const index = items.findIndex((i) => i.id === id);

    if (index === -1) {
      res.status(404).send('Item not found');
    } else {
      const deletedItem = items.splice(index, 1)[0];
      await fs.writeFile(FILE_PATH, JSON.stringify(items));
      res.send(deletedItem);
    }
  } catch (err) {
    res.status(500).send('Internal server error');
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



