
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createTicket } from '../../../slices/ticketsSlice';

function QueueForm({ rideInfo }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Destructure ride information
  if (rideInfo) var { id, location } = rideInfo; 

  // State for customer info
  const [cusInfo, setCusInfo] = useState({ name: '', number: '' });
  
  // Handlers for setting name and number
  const setNameValue = (e) => setCusInfo({ ...cusInfo, name: e.target.value });
  const setNrValue = (e) => setCusInfo({ ...cusInfo, number: e.target.value });

  // Create a ticket ID and dispatch the ticket creation action
  const createTicketId = async () => {
    const createTicketWrapper = async (detail) => dispatch(createTicket(detail));
    const detail = { 
      ...cusInfo, 
      rideId: id, // Reference ride ID instead of restaurant
      status: 'waiting', 
      customerId: cusInfo.number,
    };
    const newTicket = await createTicketWrapper(detail);
    return newTicket.payload.ticketId;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.removeItem('cancelled');
    const ticketId = await createTicketId();
    // Navigate to feedback page with ride details
    navigate(`/customer/feedback/?ticketId=${ticketId}&rideId=${id}`, { state: { location } });
  };

  return (
    <div className='list-container'>
      <p className="text">Enter your name and number to join the ride queue:</p>
      <form onSubmit={handleSubmit}>
        <div className='form'>
          <input className='form-input' 
                 type="text" 
                 placeholder="Name" 
                 onChange={setNameValue} 
                 required 
          />
          <input className='form-input' 
                 type="number" 
                 placeholder="Number"  
                 onChange={setNrValue} 
                 required 
          />
          <button className='button' type='submit'>Join the Queue</button>
        </div>
      </form>
    </div>
  );
}

export default QueueForm;

// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import {createTicket} from '../../../slices/ticketsSlice'

// function QueueForm({ restaurantInfo }) {
//   const dispatch = useDispatch()
//   const navigate = useNavigate();
//   if (restaurantInfo) var { id, geometry: { location } } = restaurantInfo 
  
//   const [cusInfo, setCusInfo] = useState({name:'', number:''})
//   const setNameValue = (e)=> setCusInfo({...cusInfo, name:e.target.value})
//   const setNrValue = (e)=> setCusInfo({...cusInfo, number:e.target.value})

//   const createTicketId = async () => {
//     const createTicketWrapper = async (detail) => dispatch(createTicket(detail));
//     const detail = { ...cusInfo, resId: id, status: 'waiting', customerId: cusInfo.number, }
//     const newTicket = await createTicketWrapper(detail);
//     return newTicket.payload.ticketId
//   }
    
//   const handleSubmit = async (e)=>{
//     e.preventDefault();
//     localStorage.removeItem('cancelled')
//     const ticketId = await createTicketId();
//     navigate(`/customer/feedback/?ticketId=${ticketId}&businessId=${id}`, { state: { location }});
//   }

//   return (
//     <div className='list-container'>
//       <p className="text">Enter your name and number:</p>
//       <form onSubmit={handleSubmit} >
//         <div className='form'>
//           <input className='form-input' type="text" placeholder="Name" onChange={setNameValue} required/>
//           <input className='form-input' type="number" placeholder="Number"  onChange={setNrValue} required/>
//         <button className='button' type='submit'>Join the Queue</button>
//         </div>
//       </form >
//     </div>
//   )
// }

// export default QueueForm
