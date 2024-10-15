import React from "react";
import './SignIn.css'
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate=useNavigate();
  function handleOnclick(){
    navigate("/login");
  }
  return (
    <div className='login-page'>
      <h2 className='login-page__title'> Welcome to  JoinTheQ Business Page!</h2>
      <button  className='login__btn' onClick={handleOnclick}>Log in/Sign Up</button>
    </div>
  )
};

export default SignIn;
