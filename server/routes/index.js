import express from "express";
import {
  getTickets, getTicketsByRideId, getTicketById, addOneTicket, updateTicketStatus, deleteTicket,
  getRides, getRideById, addOneRide,
  setToWaiting,
  updateUserInfo, getUserByEmail,
  register, login // <-- Importing new controller functions for login and register
} from './controller.js';

var router = express.Router();

// Tickets routes
router.get('/tickets/ride', getTickets);
router.get('/tickets/ride/:id', getTicketsByRideId);  // Updated to use ride instead of business
router.get('/tickets/:id', getTicketById);
router.post('/tickets', addOneTicket);
router.put('/tickets/:id', updateTicketStatus);
router.delete('/tickets/:id', deleteTicket);

// Rides routes
router.get('/rides', getRides);  // Updated to get all rides
router.get('/rides/:id', getRideById);  // Updated to get a ride by its ID
router.post('/rides', addOneRide);  // Updated to add a new ride

// Google API route
// router.get('/getGoogleData/:name', fetchDataFromGoogle);

// Waiting status update route
router.get('/setToWaiting', setToWaiting);

// User info update and get routes
router.put('/user/:email', updateUserInfo);
router.get('/user/:email', getUserByEmail);

// Register route
router.post('/register', register);  // New route for user registration

// Login route
router.post('/login', login);  // New route for user login

export default router;



// import { resObj, ticketsObj } from './mockData.js';
// import express from "express"
// import{
//     getTickets, getTicketsByBusinessId, getTicketById, addOneTicket, updateTicketStatus, deleteTicket,
//     getBusiness, getRideById, addOneRide,
//     fetchDataFromGoogle, setToWaiting,
//     updateUserInfo, getUserByEmail
// } from './controller.js'

// var router = express.Router();

// router.get('/tickets', getTickets)
// router.get('/tickets/business/:id',getTicketsByBusinessId)
// router.get('/tickets/:id', getTicketById)
// router.post('/tickets', addOneTicket)
// router.put('/tickets/:id', updateTicketStatus)
// router.delete('/tickets/:id', deleteTicket)

// router.get('/business', getBusiness)
// router.get('/business/:id', getRideById)
// router.post('/business', addOneRide)

// router.get('/getGoogleData/:name',fetchDataFromGoogle)
// router.get('/setToWaiting', setToWaiting)

// router.put('/user/:email', updateUserInfo)
// router.get('/user/:email', getUserByEmail)

// export default router



//const { database } = await connectToDatabase();
// await database.collection('tickets').remove({})
// await database.collection('tickets').insertMany(ticketObj)

// await database.collection('restaurants').remove({})
// await database.collection('restaurants').insertMany(resObj)



