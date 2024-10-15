// import './customerHome.css'
// import RestaurantItem from './RestaurantItem'
// import React from 'react'
// import { useSelector } from 'react-redux'
// import ClockLoader from "react-spinners/ClockLoader";

// const RestaurantList = ({ search, cusLocation }) => {
//   const { allBusiness,areLoading } = useSelector(store => store.businessReducer)
  
//   const searchMatches = (restaurant) =>
//     search === "" || restaurant.name?.toLowerCase().includes(search.toLowerCase())

//   const override = { display: "block", position: "absolute", top: "50%", left: "45%", margin: "0 auto", borderColor: "red", };
//   if (areLoading)
//     return <ClockLoader color={'#4A90E2'} loading={areLoading} size={100} cssOverride={override} />
  
//   return (
//     <div >
//       <ul className='list__container'>
//         {allBusiness
//           ?.filter(restaurant => searchMatches(restaurant) && restaurant)
//           .map((restaurant,index) => (
//             <RestaurantItem
//               key={index}
//               restaurantInfo = {restaurant}
//               cusLocation={cusLocation}
//             />
//           ))
//         }
//       </ul>
//     </div>
//   )
// };

// export default RestaurantList;

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRides, getRideById, updateRideId } from '../../../slices/ridesSlice';

const QueueList = () => {
  const dispatch = useDispatch();
  const { allRides, loading, error } = useSelector((state) => state.ridesReducer);

  useEffect(() => {
    dispatch(fetchRides()); // Fetch rides when the component mounts
  }, [dispatch]);

  if (loading) return <div>Loading rides...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {allRides.length > 0 ? (
        <ul>
          {allRides.map((ride) => (
            <li key={ride.id}>{ride.name}</li>
          ))}
        </ul>
      ) : (
        <div>No rides available.</div>
      )}
    </div>
  );
};

export default QueueList;


