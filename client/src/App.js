import Customer from './components/customer/Customer';
import Business from './components/business/Rides';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { fetchTickets } from './slices/ticketsSlice';
import { fetchRides } from './slices/ridesSlice';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import NotFound from './components/NotFound';
import Home from './components/customer/home/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import RideDetail from './components/ride/RideDetails';

function App() {
  const dispatch = useDispatch();
  const { ticketsUpdateFlag, tickets } = useSelector((store) => store.ticketsReducer);

  // Fetch tickets and rides when the component mounts and when ticketsUpdateFlag changes
  useEffect(() => {
    const fetchTicketsWrapper = async () => dispatch(fetchTickets());
    const fetchRidesWrapper = async () => dispatch(fetchRides());
    
    // Fetch tickets and rides initially
    fetchTicketsWrapper();
    fetchRidesWrapper();
    
    // Set an interval to periodically fetch updated tickets
    const interval = setInterval(() => fetchTicketsWrapper(), 2000);
    
    // Clean up interval when the component unmounts
    return () => clearInterval(interval);
  }, [ticketsUpdateFlag, JSON.stringify(tickets)]);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          Route for the customer
          <Route path="/customer/*" element={<Customer />} />
          <Route path="/home" element={<Home />} />
          {/* Routes for login and registration */}
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          {/* Route for business (rides) */}
          <Route path="/rides/*" element={<Business />} />
          <Route path="/ride/:id" element={<RideDetail />} />
          {/* Default route */}
          <Route path="/" element={<Customer />} />

          {/* Route for 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;



// import Customer from './components/customer/Customer';
// import Business from './components/business/Rides';
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { fetchTickets } from './slices/ticketsSlice'
// import { fetchRides} from './slices/ridesSlice'
// import { useDispatch, useSelector } from 'react-redux'
// import React, { useEffect,useState } from 'react'
// import NotFound from './components/NotFound'
// import Home from './components/customer/home/Home';
// import { getcustomerLocation } from './utils';
// import Login from './components/Login/Login'
// import Register from './components/Register/Register';

// function App() {
//   const dispatch = useDispatch()
//   const { ticketsUpdateFlag, tickets } = useSelector((store) => store.ticketsReducer);
  
//   const [cusLocation, setcusLocation] = useState(null)
//   useEffect(() => {getcustomerLocation(setcusLocation)}, []);
  
//   useEffect(() => {
//     getcustomerLocation(setcusLocation)
//     const fetchTicketsWrapper = async () => dispatch(fetchTickets());
//     const fetchRidesWrapper = async () => dispatch(fetchRides());
//     setInterval(() => fetchTicketsWrapper(), 2000);
//     fetchTicketsWrapper()
//     fetchRidesWrapper();
//   }, [ticketsUpdateFlag, JSON.stringify(tickets)])

//   return (
//     <div className="App">
//       <BrowserRouter>
//         <Routes>
//           <Route path="/customer/*" element={<Customer cusLocation={cusLocation}/>}/>
//           <Route path="/rides/Login" element={<Login/>} />
//           <Route path="/rides/Register" element={<Register/>} />
//           <Route path="/rides/*" element={<Business />} />

//           <Route path="/" element={<Customer cusLocation={cusLocation} />}/>
//           <Route path="*" element={<NotFound />}/>
//         </Routes>
//       </BrowserRouter>
//     </div>
//   );
// }

// export default App;
