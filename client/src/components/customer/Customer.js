import React, { useEffect, useState } from 'react'
import {Routes,Route} from "react-router-dom";
import Home from './home/Home';
import Restaurant from './restaurant/Restaurant';
import Feedback from './feedback/Feedback';
import Navbar from '../Navbar/Navbar.js'
import NotFound from '../NotFound';

function Customer() {
  return (
    <>
    <Navbar customerPage={true} />
    <Routes>
      <Route path="/home" element={<Home/>} />
      <Route path="restaurant/:resId" element={<Restaurant />} />
      <Route path="feedback" element={<Feedback />} />
      <Route path="/" element={<Home/>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  )
}

export default Customer
