
// Assuming you've renamed the CSS file to match the ride theme
import QueueForm from './QueueForm';
import DetailCard from './DetailCard';
import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { getRideById } from '../../../slices/ridesSlice';

const Ride = () => {
  const { rideId } = useParams(); // Changed to use "rideId"
  
  // Get ride details using the rideId from the Redux store
  const rideInfo = useSelector(store => getRideById(store, rideId));

  return (
    <div className="ride__container"> {/* Changed the CSS class name */}
      {/* Pass the rideInfo object to the DetailCard and QueueForm components */}
      <DetailCard rideInfo={rideInfo} />
      <QueueForm rideInfo={rideInfo} id={rideId} />
    </div>
  );
}

export default Ride;


// import './Restaurant.css'
// import QueueForm from './QueueForm'
// import DetailCard from './DetailCard'
// import React from 'react'
// import { useSelector } from 'react-redux'
// import { useParams } from "react-router-dom";
// import { getRideById } from '../../../slices/ridesSlice'

// const Restaurant = () => {
//   const { resId } = useParams();
//   const restaurantInfo = useSelector(store =>getRideById(store, resId))

//   return (
//     <div className="store__container">
//       <DetailCard restaurantInfo = {restaurantInfo} />
//       <QueueForm restaurantInfo={restaurantInfo} id={resId } />
//     </div>
//   )
// }

// export default Restaurant
