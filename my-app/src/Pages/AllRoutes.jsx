import React from 'react'
import NavBar from '../Component/NavBar'
import Product from './Product'
import Login from './LogIn'
import Signup from './SignUp'
import Ship from './Ship'
import Cart from './Cart'
import {Routes,Route} from "react-router-dom";
const AllRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Product/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/ship" element={<Ship/>} />
        <Route path="/cart" element={<Cart/>} />

        </Routes>
  )
}

export default AllRoutes