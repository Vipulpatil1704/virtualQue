import React from 'react'
import { Link } from 'react-router-dom'

function NavCusPart({isAuthenticated}) {
  return (
    <>
      {!isAuthenticated
      ?<Link to="/rides/SignIn">Business</Link>
      :<Link to="/rides/profile">Business</Link>
      } 
      <Link to="/customer/home">Home</Link>
      <Link to="about">About</Link>
    </>
  )
}

export default NavCusPart
