// import axios from 'axios';
// import About from '../About/About'
// import Signup from './SignUp/Signup'
// import SignIn from './SignIn/SignIn'
// import Logout from './Logout/Logout';
// import Profile from './Profile/Profile.js'
// import Navbar from '../Navbar/Navbar.js'
// import TicketList from './ticketList/TicketList'
// import React, { useEffect } from 'react'
// import { Routes, Route } from "react-router-dom";
// import { useAuth0 } from '@auth0/auth0-react';
// import { useDispatch, useSelector } from 'react-redux'
// import { updateRideId } from '../../slices/businessSlice'

// function Business() {
//   const dispatch = useDispatch();
//   const { user, isAuthenticated } = useAuth0();
//   const { businessId } = useSelector((store) => store.businessReducer);
  
//   const getExistedBizId = async () => {
//     const userFromDB = user && await axios.get(`/api/user/${user.email}`)
//     const bizId = userFromDB?.data.businessId;
//     bizId && dispatch(updateRideId(bizId))
//   }

//   useEffect(()=> {
//     getExistedBizId()
//   }, [isAuthenticated])

//   return (
//     <>
//     <Navbar businessId={businessId} customerPage={false} />
//     <Routes>
//       {!isAuthenticated
//       ? <React.Fragment>
//         Please Login.
//         <Route path='/signIn' element={<SignIn />} />
//       </React.Fragment>
//       :<React.Fragment>
//         <Route path='/logout' element={<Logout/>}/>
//         <Route path="ticketList/:businessId" element={<TicketList/>} />
//         <Route path='/profile' element={<Profile user={user} businessId={businessId}/>}/>
//         <Route path='/signUp' element={<Signup />}/>
//       </React.Fragment>}
//       <Route path='/about' element={<About />} />
//     </Routes>
//   </>
//   )
// }

// export default Business

import axios from 'axios';
import Signup from './SignUp/Signup.js';
import SignIn from './SignIn/SignIn.js';
import Logout from './Logout/Logout.js';
import Profile from './Profile/Profile.js';
import Navbar from '../Navbar/Navbar.js';
import TicketList from './ticketList/TicketList.js'; // Adjust this for rides if necessary
import React, { useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateRideId } from '../../slices/ridesSlice.js'; // Updated slice for rides

function Rides() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth0();
  const { rideId } = useSelector((store) => store.ridesReducer); // Accessing ride-related state

  const getExistedRideId = async () => {
    const userFromDB = user && await axios.get(`/api/user/${user.email}`);
    const rideId = userFromDB?.data.rideId; // Fetch ride ID from the user's data
    rideId && dispatch(updateRideId(rideId)); // Dispatch to update the ride ID in the state
  };

  useEffect(() => {
    if (isAuthenticated) {
      getExistedRideId(); // Fetch the ride ID if the user is authenticated
    }
  }, [isAuthenticated]);

  return (
    <>
      <Navbar rideId={rideId} customerPage={false} /> {/* Pass rideId instead of businessId */}
      <Routes>
        {!isAuthenticated
          ? <React.Fragment>
              Please Login.
              <Route path='/signIn' element={<SignIn />} />
            </React.Fragment>
          :<React.Fragment>
              <Route path='/logout' element={<Logout />} />
              <Route path="ticketList/:rideId" element={<TicketList />} /> {/* Adjusted route to use rideId */}
              <Route path='/profile' element={<Profile user={user} rideId={rideId} />} /> {/* Pass rideId instead of businessId */}
              <Route path='/signUp' element={<Signup />} />
            </React.Fragment>
        }
      </Routes>
    </>
  );
}

export default Rides;
