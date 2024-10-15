// import queue from './queue.png';
// import clock from './stopwatch.png';
// import { getDistance } from 'geolib';
// import { Link } from 'react-router-dom'
// import React from 'react'
// import { useSelector } from 'react-redux'
// import { getTicketsForOneBiz } from '../../../slices/ticketsSlice'

// function RestaurantItem({ restaurantInfo, cusLocation }) {
//   const { name, id, formatted_address, waitingTime, imgLink, geometry:{location}} = restaurantInfo;
//   const tickets = useSelector(store => getTicketsForOneBiz(store, id))
  
//   const distanceLoc = location && cusLocation && getDistance(location, cusLocation)
//   const distance =  (distanceLoc / 1000).toFixed(1)
 
//   const peopleWaiting = tickets?.filter(t=>t.status == 'waiting').length;
//   const minDisplay = peopleWaiting  ? waitingTime * peopleWaiting +' mins' : 'No Q!'
  
//   return (
//     <Link to= {`/customer/restaurant/${id}`}>
//       <div className='card'>
//         <div className='restaurant-card__top'>
//           <img className='restaurant-card__image' src={imgLink} alt= {`${name}`} />
//           <h6 className='text grey-text waiting-time row'> <img src={clock} className='queue-icon' alt='logo' /> <p className='text no-padding'>{minDisplay}</p></h6>
//           <h3 className='text restaurant-card__text--name small-padding'>{name}</h3>
//         </div>
//         <div className='restaurant-card__footer'>
//           <div className='column'>
//             <p className='text restaurant-card__text--address 10px'>{formatted_address}</p>
//             {distance && distance > 0
//             ? <h6 className='text restaurant-card__text--distance'>{distance}km From You</h6>
//             : <h6 className='text restaurant-card__text--distance' >Calculating distance...</h6>}
//           </div>
//           {tickets &&
//           <div className='restaurant-card__queue'> 
//             <img src={queue} className='queue-icon' alt='logo' />
//             <p className="text restaurant-card__text--queue">{peopleWaiting}</p>
//           </div>}
//         </div>
//       </div>
//     </Link>
//   )
// }

// export default RestaurantItem

import queue from './queue.png';
import clock from './stopwatch.png';
import { getDistance } from 'geolib';
import { Link } from 'react-router-dom';
import React from 'react';
import { useSelector } from 'react-redux';
import { getTicketsForOneRide } from '../../../slices/ticketsSlice'; // Adjusted for ride tickets

function RideItem({ rideInfo, cusLocation }) {
  const { name, id, formatted_address, waitingTime, imgLink, geometry: { location } } = rideInfo;
  const tickets = useSelector(store => getTicketsForOneRide(store, id));  // Adjusted to fetch ride tickets
  
  const distanceLoc = location && cusLocation && getDistance(location, cusLocation);
  const distance = (distanceLoc / 1000).toFixed(1);
  
  const peopleWaiting = tickets?.filter(t => t.status === 'waiting').length;
  const minDisplay = peopleWaiting ? waitingTime * peopleWaiting + ' mins' : 'No Q!';
  
  return (
    <Link to={`/customer/ride/${id}`}>
      <div className='card'>
        <div className='ride-card__top'>
          <img className='ride-card__image' src={imgLink} alt={`${name}`} />
          <h6 className='text grey-text waiting-time row'>
            <img src={clock} className='queue-icon' alt='logo' />
            <p className='text no-padding'>{minDisplay}</p>
          </h6>
          <h3 className='text ride-card__text--name small-padding'>{name}</h3>
        </div>
        <div className='ride-card__footer'>
          <div className='column'>
            <p className='text ride-card__text--address 10px'>{formatted_address}</p>
            {distance && distance > 0
              ? <h6 className='text ride-card__text--distance'>{distance}km From You</h6>
              : <h6 className='text ride-card__text--distance'>Calculating distance...</h6>}
          </div>
          {tickets && 
            <div className='ride-card__queue'>
              <img src={queue} className='queue-icon' alt='logo' />
              <p className="text ride-card__text--queue">{peopleWaiting}</p>
            </div>
          }
        </div>
      </div>
    </Link>
  );
}

export default RideItem;


