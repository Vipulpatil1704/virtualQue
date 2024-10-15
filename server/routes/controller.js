import axios from 'axios';
import { connectToDatabase } from "../mongodb.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const dbQuery = async (callback) => {
  const { database } = await connectToDatabase();
  const ridesCol = await database.collection('rides');  // Updated for rides
  const ticketsCol = await database.collection('tickets');
  const usersCol = await database.collection('users');
  const result = { ridesCol, ticketsCol, usersCol };
  return callback(result);
};

// Register Logic
const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ success: false, msg: 'All fields are required' });
  }

  // Check if the email already exists in the database
  const { database } = await connectToDatabase();
  const usersCol = database.collection('users');
  
  const userExists = await usersCol.findOne({ email });
  if (userExists) {
    return res.status(400).json({ success: false, msg: 'Email already exists' });
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user object
  const newUser = {
    firstName,
    lastName,
    email,
    password: hashedPassword,
  };

  // Insert new user into the database
  await usersCol.insertOne(newUser);

  // Return success response
  return res.status(201).json({
    success: true,
    msg: 'Registration successful',
    user: {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
    },
  });
};

// Login Logic
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, msg: 'Please provide both email and password' });
  }

  // Fetch user from the database
  const { database } = await connectToDatabase();
  const usersCol = database.collection('users');
  
  const user = await usersCol.findOne({ email });
  if (!user) {
    return res.status(400).json({ success: false, msg: 'Invalid email or password' });
  }

  // Compare provided password with the hashed password in the database
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ success: false, msg: 'Invalid email or password' });
  }

  // Generate a JWT token
  const payload = {
    user: {
      id: user._id,
      email: user.email,
    },
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  return res.status(200).json({
    success: true,
    msg: 'Login successful',
    token: token, // Send the token in the response
  });
};

// Get all tickets
const getTickets = async (req, res) => {
  await dbQuery(async result => {
    const tickets = await result.ticketsCol.find({}).toArray();
    if (tickets) return res.status(200).send(tickets);
    return res.status(404).json({ success: false, msg: `Can't find tickets` });
  });
};

// Get a ticket by its ID
const getTicketById = async (req, res) => {
  const { id } = req.params;
  await dbQuery(async result => {
    const getOneTicket = async id => await result.ticketsCol.findOne({ ticketId: Number(id) });
    const ticket = await getOneTicket(id);
    if (ticket) return res.status(200).json(ticket);
    return res.status(404).json({ success: false, msg: `No ticket found with id:${id}` });
  });
};

// Get tickets by ride ID
// const getTicketsByRideId = async (req, res) => {
//   const { id } = req.params;
//   await dbQuery(async result => {
//     const getTickets = async id => await result.ticketsCol.find({ rideId: Number(id) }).toArray();  // Updated for rides
//     const tickets = await getTickets(id);
//     if (tickets) return res.status(200).json(tickets);
//     return res.status(404).json({ success: false, msg: `No tickets found with ride id:${id}` });
//   });
// };
const getTicketsByRideId = async (rideId, ticketsCollection) => {
  try {
    const tickets = await ticketsCollection.find({ rideId: Number(rideId) }).toArray();
    return tickets;
  } catch (error) {
    console.error(`Error fetching tickets for ride ${rideId}:`, error);
    return [];
  }
};
// Add a new ticket
const addOneTicket = async (req, res) => {
  await dbQuery(async result => {
    const tickets = await result.ticketsCol.find({}).toArray();
    const ticketId = tickets.length + 1;
    const newTicket = { ...req.body, ticketId };
    if (req.body) await result.ticketsCol.insertOne(newTicket);
    res.status(200).json(newTicket);
  });
};

// Delete a ticket
const deleteTicket = async (req, res) => {
  await dbQuery(async result => {
    const { id } = req.params;
    await result.ticketsCol.deleteOne({ ticketId: Number(id) });
    res.status(200).json({ message: `Ticket with id ${id} deleted` });
  });
};

// Get all rides
// const getRides = async (req, res) => {
//   await dbQuery(async result => {
//     const rides = await result.ridesCol.find().toArray();  // Updated to use rides collection
//     if (rides) return res.status(200).json(rides);
//     return res.status(404).json({ success: false, msg: `Can't find rides` });
//   });
// };
// Backend Route: Fetch rides with additional information

const getRides = async (req, res) => {
  try {
    const { database } = await connectToDatabase();
    const ridesCollection = database.collection('rides');
    const ticketsCollection = database.collection('tickets'); // Assuming tickets are stored in 'tickets' collection

    const rides = await ridesCollection.find({}).toArray(); // Fetch all rides
    // console.log(rides);

    const ridesWithDetails = await Promise.all(
      rides.map(async (ride) => {
        const tickets = await getTicketsByRideId(ride._id, ticketsCollection); // Fetch tickets by ride id
        const queueLength = tickets.length;
        const waitingTime = queueLength * 5; // Assuming 5 minutes per person in the queue

        return {
          ...ride,
          queueLength,
          waitingTime,
          peopleInQueue: queueLength, // Add additional properties
        };
      })
    );

    res.status(200).json({ success: true, rides: ridesWithDetails });
  } catch (error) {
    console.error('Error fetching rides:', error);
    res.status(500).json({ success: false, msg: 'Failed to fetch rides' });
  }
};


// Get a ride by its ID
const getRideById = async (req, res) => {
  const { id } = req.params;
  await dbQuery(async result => {
    const getOneRide = async id => await result.ridesCol.findOne({ rideId: Number(id) });  // Updated for rides
    const ride = await getOneRide(id);
    if (ride) return res.status(200).json(ride);
    return res.status(404).json({ success: false, msg: `No ride found with id:${id}` });
  });
};

// Add a new ride
const addOneRide = async (req, res) => {
  await dbQuery(async result => {
    const rides = await result.ridesCol.find({}).toArray();
    const rideId = rides.length + 1;
    const newRide = { ...req.body, rideId };
    if (req.body) await result.ridesCol.insertOne(newRide);
    res.status(200).json(newRide);
  });
};

// Update ticket status
const updateTicketStatusInDB = async (id, status) => {
  return await dbQuery(async result => {
    const updateDoc = { $set: { status: status } };
    const ticketResult = await result.ticketsCol.findOneAndUpdate({ ticketId: id }, updateDoc, { 'returnNewDocument': true });
    return ticketResult.value;
  });
};

// Update ticket status by ID
const updateTicketStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const ticket = await updateTicketStatusInDB(Number(id), status);
  return res.status(200).json(ticket);
};

// Update user information (such as rideId)
const updateUserInfo = async (req, res) => {
  const { email } = req.params;
  const { rideId } = req.body;  // Updated to work with rideId
  await dbQuery(async result => {
    res.status(200).send(`RideId ${rideId} set to user ${email}`);
    const userResult = await result.usersCol.findOneAndUpdate({ email }, { $set: { rideId } }, { 'returnNewDocument': true });
    return userResult.value;
  });
};

// Get user by email
const getUserByEmail = async (req, res) => {
  const { email } = req.params;
  await dbQuery(async result => {
    const getUser = async email => await result.usersCol.findOne({ email });
    const user = await getUser(email);
    if (user) return res.status(200).json(user);
    return res.status(404).json({ success: false, msg: `No user found with email:${email}` });
  });
};
const setToWaiting = async (req, res) => {
  await dbQuery(async result => {
    res.status(200).send(`All status set to waiting!`)
    return await result.ticketsCol.updateMany({ status: { $ne: 'waiting' } }, { $set: { status: 'waiting' } })
  })
}
export {
  getTickets, getTicketsByRideId, getTicketById, addOneTicket, updateTicketStatus, deleteTicket,
  getRides, getRideById, addOneRide,
  updateUserInfo, getUserByEmail,setToWaiting,
  register, login // Include the register and login methods
};





// import axios from 'axios'
// import { connectToDatabase } from "../mongodb.js";

// const dbQuery = async (callback) => {
//   const { database } = await connectToDatabase();
//   const businessCol = await database.collection('restaurants')
//   const ticketsCol = await database.collection('tickets')
//   const usersCol = await database.collection('users')
//   const result = { businessCol, ticketsCol, usersCol }
//   return callback(result)
// }

// const getTickets = async (req, res) => {
//   await dbQuery(async result => {
//     const tickets = await result.ticketsCol.find({}).toArray()
//     if (tickets) return res.status(200).send(tickets)
//     return res.status(404).json({ success: false, msg: `Can't find tickets` });
//   })
// }

// const getTicketById = async (req, res) => {
//   const { id } = req.params;
//   await dbQuery(async result => {
//     const getOneTicket = async id => await result.ticketsCol.findOne({ ticketId: Number(id) })
//     const ticket = await getOneTicket(id)
//     if (ticket) return res.status(200).json(ticket);
//     return res.status(404).json({ success: false, msg: `No ticket found with id:${id}` });
//   })
// }

// const getTicketsByBusinessId = async (req, res) => {
//   const { id } = req.params;
//   await dbQuery(async result => {
//     const getTickets = async id => await result.ticketsCol.find({ resId: Number(id) }).toArray()
//     const tickets = await getTickets(id)
//     if (tickets) return res.status(200).json(tickets);
//     return res.status(404).json({ success: false, msg: `No tickets found with busines id:${id}` });
//   })
// }

// const addOneTicket = async (req, res) => {
//   await dbQuery(async result => {
//     const tickets = await result.ticketsCol.find({}).toArray()
//     const ticketId = tickets[tickets.length - 1].ticketId + 1
//     const newTicket = { ...req.body, ticketId };
//     if (req.body) await result.ticketsCol.insertOne(newTicket)
//     res.status(200).json(newTicket)
//   })
// }

// const deleteTicket = async (req, res) => {
//   await dbQuery(async result => {
//     const { id } = req.params;
//     await result.ticketsCol.deleteOne({ ticketId: Number(id) })
//     res.status(200).json({ message: `ticket with id ${id} deleted` })
//   })
// }

// const getBusiness = async (req, res) => {
//   await dbQuery(async result => {
//     const business = await result.businessCol.find().toArray();
//     if (business) return res.status(200).json(business)
//     return res.status(404).json({ success: false, msg: `Can't find business` });
//   })
// }

// const getRideById = async (req, res) => {
//   const { id } = req.params;
//   await dbQuery(async result => {
//     const getOneBiz = async id => await result.businessCol.findOne({ id: Number(id) });
//     const biz = await getOneBiz(id)
//     if (biz) return res.status(200).json(biz);
//     return res.status(404).json({ success: false, msg: `No busines with id:${id}` });
//   })
// }

// const addOneRide = async (req, res) => {
//   await dbQuery(async result => {
//     const business = await result.businessCol.find({}).toArray()
//     const businessId = business.length + 1
//     const newBusiness = { ...req.body, businessId };
//     if (req.body) await result.businessCol.insertOne(newBusiness)
//     res.status(200).json(newBusiness)
//   })
// }

// const updateTicketStatusInDB = async (id, status) => {
//   return await dbQuery(async result => {
//     const updateDoc = { $set: { status: status } };
//     const ticketResult = await result.ticketsCol.findOneAndUpdate({ ticketId: id }, updateDoc, { 'returnNewDocument': true })
//     return ticketResult.value
//   })
// }

// const updateTicketStatus = async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;
//   const ticket = await updateTicketStatusInDB(Number(id), status)
//   return res.status(200).json(ticket);
// }

// // const getGooglePhotoSrc = async (googlePhotoRef)=>{
// //     const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${googlePhotoRef}&key=${process.env.GOOGLEMAP_API}`
// //     const raw = await axios
// //       .get(url, {
// //         responseType: 'arraybuffer'
// //       })
// //     let base64 = Buffer.from(raw.data, "binary").toString("base64");
// //     let imgSrc = `data:${raw.headers["content-type"]};base64,${base64}`;
// //     return imgSrc
// // }

// const fetchDataFromGoogle = async (req, res) => {
//   let { name } = req.params;
//   const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry%2Cphotos&input=${name}&inputtype=textquery&key=${process.env.GOOGLEMAP_API}`
//   const data = await axios.get(url)
//   const candidates = data.data.candidates;

//   // const getData = async () => {
//   //   return Promise.all(candidates.map(biz => {
//   //     if (biz.photos) {
//   //         return getGooglePhotoSrc(biz.photos[0].photo_reference)
//   //             .then(imgSrc=> {
//   //                 biz.photos = imgSrc
//   //                 return biz})
//   //             .then(biz=> biz)
//   //             .catch(e=>
//   //             }
//   //     //
//   //   }))
//   // }
//   res.json(candidates);
// }

// const setToWaiting = async (req, res) => {
//   await dbQuery(async result => {
//     res.status(200).send(`All status set to waiting!`)
//     return await result.ticketsCol.updateMany({ status: { $ne: 'waiting' } }, { $set: { status: 'waiting' } })
//   })
// }

// const updateUserInfo = async (req, res) => {
//   const { email } = req.params
//   const { businessId } = req.body
//   await dbQuery(async result => {
//     res.status(200).send(`BusinessId ${businessId} set to user ${email}`)
//     const userResult = await result.usersCol.findOneAndUpdate({ email }, { $set: { businessId } }, { 'returnNewDocument': true })
//     return userResult.value
//   })
// }

// const getUserByEmail = async (req, res) => {
//   const { email } = req.paramsj
//   await dbQuery(async result => {
//     const getUser = async email => await result.usersCol.findOne({ email });
//     const user = await getUser(email)
//     if (user) return res.status(200).json(user);
//     return res.status(404).json({ success: false, msg: `No User with email:${email}` });
//   })
// }

// export {
//   getTickets, getTicketsByBusinessId, getTicketById, addOneTicket, updateTicketStatus, deleteTicket,
//   getBusiness, getRideById, addOneRide,
//   fetchDataFromGoogle, setToWaiting,
//   updateUserInfo, getUserByEmail
// }
