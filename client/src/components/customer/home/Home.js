// import React,{useState} from 'react'
// import RestaurantList from './RestaurantList'

 
// function Home({ cusLocation }) {
//   const [search, setSearch] = useState("")
  
//   return (
//     <>
//       <form className="form">
//         <input
//           className="form-input"
//           type="text"
//           value={search}
//           placeholder="Search for a restaurant..."
//           onChange={event => setSearch(event.target.value)}
//         />
//       </form>
//       {<RestaurantList search={search} cusLocation={cusLocation} />}
//     </>
//   )
// }

// export default Home

import RideList from './RideList';  // Assuming you have a RideList component similar to RestaurantList


import React, { useEffect } from 'react'; // Import React and useEffect
import { useDispatch, useSelector } from 'react-redux'; // Import useDispatch and useSelector from Redux
import { fetchRides } from '../../../slices/ridesSlice'; // Import fetchRides action
import { Link } from 'react-router-dom'; // Import Link from react-router-dom for navigation

const Home = () => {
  const dispatch = useDispatch();
  const rides = useSelector((state) => state.ridesReducer.allRides); // Access the rides from the Redux state
  const ridesStatus = useSelector((state) => state.ridesReducer.status); // Access the status of the rides fetching

  useEffect(() => {
    if (ridesStatus === 'idle') {
      dispatch(fetchRides()); // Dispatch the fetchRides action if status is 'idle'
    }
  }, [dispatch, ridesStatus]); // Fetch rides when the component mounts or status changes
  if (ridesStatus === 'loading') {
    return <div>Loading rides...</div>; // Show loading message while fetching
  }

  if (ridesStatus === 'failed') {
    return <div>Error loading rides</div>; // Show error message if fetching failed
  }

  // Ensure `rides` is not undefined or null before mapping over it
  if (!rides || rides.length === 0) {
    return <div>No rides available.</div>; // Show message if no rides are available
  }

  return (
    <div className="rides-list">
      <h1>Available Rides</h1>
      {rides.map((ride) => (
        <div key={ride._id} className="ride-item">
          <h2>{ride.name}</h2>
          <p>Description: {ride.description}</p>
          <p>Queue Length: {ride.queueLength}</p>
          <p>People in Queue: {ride.peopleInQueue}</p>
          <p>Approx. Waiting Time: {ride.waitingTime} minutes</p>
          <Link to={`/ride/${ride._id}`} className="ride-details-link">
            Join queue
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Home;


