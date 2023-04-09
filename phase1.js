const express = require('express');
const router = express.Router();
const fs = require('fs');

class Ticket {
  constructor(id, type, subject, description, priority, status, recipient, submitter, assignee_id, follower_ids, tags) {
    this.id = id;
    this.type = type;
    this.subject = subject;
    this.description = description;
    this.priority = priority;
    this.status = status;
    this.recipient = recipient;
    this.submitter = submitter;
    this.assignee_id = assignee_id;
    this.follower_ids = follower_ids;
    this.tags = tags;
    this.created_at = new Date().toISOString();
    this.updated_at = new Date().toISOString();
  }
}

router.get('/rest/list', (req, res) => {
  fs.readFile('mydata.json', 'utf8', (err, data) => {
    if (err) {
      console.error(`Failed to read data from file: ${err}`);
      res.status(500).send('Failed to read data from file');
    } else {
      const tickets = JSON.parse(data);
      res.json(tickets);
    }
  });
});

router.get('/rest/ticket/:id', (req, res) => {
  fs.readFile('mydata.json', 'utf8', (err, data) => {
    if (err) {
      console.error(`Failed to read data from file: ${err}`);
      res.status(500).send('Failed to read data from file');
    } else {
      const tickets = JSON.parse(data);
      const ticket = tickets.find((x) => x.id === Number(req.params.id));
      return ticket
        ? res.status(200).send(JSON.stringify(ticket, null, 2))
        : res.status(404).send(`Ticket with ID ${req.params.id} not found.`);
    }
  });
});

router.post('/rest/ticket', (req, res) => {
  fs.readFile('mydata.json', 'utf8', (err, data) => {
    if (err) {
      console.error(`Failed to read data from file: ${err}`);
      res.status(500).send('Failed to read data from file');
    } else {
      let tickets = JSON.parse(data);
      const newId = tickets.length + 1;
      const newTicket = new Ticket(
        newId,
        req.body.type,
        req.body.subject,
        req.body.description,
        req.body.priority,
        req.body.status,
        req.body.recipient,
        req.body.submitter,
        req.body.assignee_id,
        req.body.follower_ids
      );
      tickets.push(newTicket);
      fs.writeFile('mydata.json', JSON.stringify(tickets), (err) => {
        if (err) {
          console.error(`Failed to write data to file: ${err}`);
          res.status(500).send('Failed to write data to file');
        } else {
          res.status(201).json(newTicket);
        }
      });
    }
  });
});

module.exports = router;

// router.get('/', function(req, res) {
//   const myquery = req.query;
//   var ticket = 'Starting... ';
//   res.send(ticket);
// });



