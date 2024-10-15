import './Profile.css'
import React from "react";
import { useSelector } from 'react-redux'
import {useNavigate} from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { getRideById } from '../../../slices/ridesSlice'
import ClockLoader from "react-spinners/ClockLoader";

const Profile = ({user, businessId}) => {
  const navigate = useNavigate();
  const {isAuthenticated, isLoading } = useAuth0();
  const biz = useSelector(store => getRideById(store, businessId))

  const override = { display: "block", position: "absolute", top: "50%", left: "45%", margin: "0 auto", borderColor: "red", };
  if (isLoading)
    return <ClockLoader color={'#4A90E2'} loading={isLoading} size={100} cssOverride={override} />
  return (
    isAuthenticated &&  (
      <div className='profile-page'>
        <h3 className='profile-itle'>My Account:<br />{user.name}</h3>
        {biz
        ? <>
          <h2 className = 'profile-title'>My Business: </h2>
          <div className="card" onClick = {() => navigate({ pathname: `/business/ticketList/${businessId}`})}>
            <h3 className = 'text large-text'>{biz.name}</h3>
            <h3 className = 'text'>{biz.formatted_address}</h3>
            <div className= 'restaurant-card__top'>
              <img className='restaurant-card__image' src={biz.imgLink} />
            </div>
          </div>
          <button className='button' onClick = {() => navigate({ pathname: `/business/ticketList/${businessId}`})}>Check My Queue</button>
        </>
        : <>
          <h3 className='profile-title'>Click here to register your business</h3>
          <button className='button' onClick = {() => navigate({ pathname: `/business/Signup`})}>Register</button></>}
      </div>
    )
  );
};

export default Profile;
