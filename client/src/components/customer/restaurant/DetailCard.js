import React from 'react';

const DetailCard = ({ rideInfo }) => {
  // Destructure the ride information if it's provided
  if (rideInfo) var { rideName, location, imgLink, description, waitTime } = rideInfo;

  return (
    <>
      <div className='card detail-card'>
        <img className='ride-card__image' src={imgLink} alt={rideName} />
        <div className='ride-card__footer'>      
          <h1 className='text ride-title'>{rideName}</h1>
          <p className='text ride-card__text--location'>{location}</p>
        </div>
        <p className='ride-card__description'>{description}</p>
        <p className='ride-card__wait-time'>Approx. Wait Time: {waitTime} minutes</p>
      </div>
    </>
  );
}

export default DetailCard;



// import React from 'react'

// const DetailCard = ({ restaurantInfo }) => {
//   if (restaurantInfo) var { name,  formatted_address, imgLink, description } = restaurantInfo

//   return (
//     <>
//       <div className='card detail-card'>
//         <img className='restaurant-card__image' src={imgLink} alt={name} />
//         <div className='restaurant-card__footer'>      
//           <h1 className='text store-title'>{name}</h1>
//           <p className='text restaurant-card__text--address'>{formatted_address}</p>
//         </div>
//         <p className='restaurant-card__description'>{description}</p>
//       </div>
//     </>

//   )
// }



// export default DetailCard
