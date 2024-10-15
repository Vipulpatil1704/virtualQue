import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateRideId } from  '../../slices/ridesSlice' // Assuming you have an action to update rides
import { createTicket } from '../../slices/ticketsSlice';

const RideDetail = () => {
  const { id } = useParams(); // Get ride ID from URL
  const ride = useSelector((state) => state.ridesReducer.allRides.find(ride => ride._id === Number(id))); // Find the ride based on ID
  console.log(ride);
  const [name, setName] = useState(''); // State for name input
  const [peopleCount, setPeopleCount] = useState(1); // State for number of people
  const dispatch = useDispatch();

  const handleJoinQueue = () => {
    if (name && peopleCount > 0) {
      const ticketDetails = {
        rideId: Number(id),           // The ride ID this ticket is for
        name,                 // The name of the person joining the queue
        peopleCount,          // Number of people joining the queue
      };
      dispatch(createTicket(ticketDetails))
    } else {
      alert("Please enter a valid name and number of people.");
    }
  };
  useSelector((state)=>console.log(state.ticketsReducer.allTickets));
  if (!ride) {
    return <p>Ride not found!</p>; // Handle case where ride is not found
  }

  return (
    <div>
      <h1>{ride.name}</h1>
      <p>{ride.description}</p>
      <p>Current Queue Length: {ride.queueLength}</p>
      <p>Average Wait Time: {ride.waitingTime} minutes</p> {/* Assuming 5 minutes per person */}
      
      {/* Input fields for name and number of people */}
      <input 
        type="text" 
        placeholder="Enter your name" 
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input 
        type="number" 
        placeholder="Enter number of people" 
        value={peopleCount}
        onChange={(e) => setPeopleCount(e.target.value)}
        min="1"
      />
      <button onClick={handleJoinQueue}>Join Queue</button>
    </div>
  );
};

export default RideDetail;
