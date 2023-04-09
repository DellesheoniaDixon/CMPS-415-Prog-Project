const express = require('express');
const fs = require('fs');
const path = require('path');

const filePath = './mydata.json';

class TicketsController {
  constructor() {
    this.router = express.Router();
    this.router.get('/rest/list', this.getList.bind(this));
    this.router.get('/rest/ticket/:id', this.getTicket.bind(this));
    this.router.post('/rest/ticket', this.createTicket.bind(this));
  }

  getTickets() {
    const rawData = fs.readFileSync(path.resolve(__dirname, filePath));
    const jsonData = JSON.parse(rawData.toString());
    return jsonData.map((data) => ({
      id: data.id,
      created_at: data.created_at,
      updated_at: data.updated_at,
      type: data.type,
      subject: data.subject,
      description: data.description,
      priority: data.priority,
      status: data.status,
      recipient: data.recipient,
      submitter: data.submitter,
      assignee_id: data.assignee_id,
      follower_ids: data.follower_ids,
      tags: data.tags,
    }));
  }

  getNextId(tickets) {
    return tickets.reduce((maxId, ticket) => {
      return Math.max(maxId, ticket.id) + 1;
    }, 1);
  }

  validateTicket(ticket) {
    const requiredProperties = [
      'type',
      'subject',
      'description',
      'priority',
      'status',
      'recipient',
      'submitter',
      'assignee_id',
    ];

    const errorMessages = requiredProperties
      .filter((property) => !ticket[property])
      .map(this.getRequiredText);

    return {
      hasErrors: errorMessages.length > 0,
      errorMessages,
    };
  }

  getRequiredText(property) {
    return `${property} is required`;
  }

  async writeTicket(ticket) {
    const tickets = this.getTickets();

    const nextTicketId = this.getNextId(tickets);
    ticket.id = nextTicketId;
    ticket.created_at = new Date().toISOString();
    ticket.updated_at = new Date().toISOString();

    const validationResult = this.validateTicket(ticket);

    if (validationResult.hasErrors) {
      return Promise.resolve({
        data: '',
        validationResult: validationResult,
      });
    }

    tickets.push(ticket);
    const updatedContent = JSON.stringify(tickets, null, 2);

    try {
      fs.writeFileSync(path.resolve(__dirname, filePath), updatedContent);
      return Promise.resolve({
        data: JSON.stringify(ticket, null, 2),
      });
    } catch (err) {
      console.log(err);
      return Promise.resolve({
        data: '',
        validationResult: {
          hasErrors: true,
          errorMessages: ['Failed to write ticket to file'],
        },
      });
    }
  }

  async getList(req, res) {
    const tickets = this.getTickets();
    return res.status(200).send(JSON.stringify(tickets, null, 2));
  }

  async createTicket(req, res) {
    const response = await this.writeTicket(req.body);

    if (response.validationResult?.hasErrors) {
      return res
        .status(400)
        .send(JSON.stringify(response.validationResult.errorMessages, null, 2));
    }

    return res.status(201).send(response.data);
  }

  async getTicket(req, res) {
    const tickets = this.getTickets();

    const ticket = tickets.find(function (x) {
      return x.id === Number(req.params.id);
    });

    return ticket
      ? res.status(200).send(JSON.stringify(ticket, null, 2))
      : res.status

// router.get('/', function(req, res) {
//   const myquery = req.query;
//   var ticket = 'Starting... ';
//   res.send(ticket);
// });



