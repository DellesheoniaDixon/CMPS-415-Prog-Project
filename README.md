# CMPS-415-Prog-Project

The project for CMPS 415 will be the development of a Node.js web app which provides CRUD operations for a help desk ticketing system. This project will be split into three phases. Each phase must be developed and submitted separately for each phase.

Phase I – Summary
Phase I will focus on the creation of a simple web service using Node and ExpressJS. This phase will focus on setting up the project in Render.com and developing the Create and Read endpoints. In this phase, tickets will be stored in memory. There will be initial tickets loaded into memory upon service startup. Students are responsible for providing an initial set of tickets if you want your app to have tickets “loaded”. Your service will allow additions to the collection of tickets as well as access to individual existing tickets. Tickets will be represented/stored in JSON.

Summary of Deliverables

Node Web Service using Node that offers 3 endpoints.
• GET - /rest/list/ = ”Endpoint to get all tickets”
This endpoint requires no input, but will return all of the JSON
objects that are in memory.
• GET - /rest/ticket/id = ”Endpoint to get a single ticket”
This endpoint requires the ID to be sent to the web app. It will return a JSON object of the ticket that has the matching ID.
• POST - /rest/ticket/ = ”Endpoint to create a new ticket”
This endpoint requires a JSON object to be sent to the web app. This object will contain all necessary fields. It will return a JSON
object of the ticket that was created.

In all cases, you will need to do your own error checking and choose how to handle cases such as “ticket not found” or “incomplete ticket info”.

Phase II – Summary
This purpose of this phase is to extend the services created in Phase I. The extension will require the addition of a database to store the tickets. Two additional endpoints will need to be developed to update and delete tickets. In this phase, your app must also provide a form for submitting a new ticket. The form should come up as an endpoint access to your app.

You should use a database solution provided by Render.com. 

Summary of Deliverables
Node Web Service using Node that offers 5 endpoints.
• DELETE - /rest/ticket/id = "Deletes a ticket record by ID"
• PUT - /rest/ticket/id = "Updates existing ticket record based on ID"



