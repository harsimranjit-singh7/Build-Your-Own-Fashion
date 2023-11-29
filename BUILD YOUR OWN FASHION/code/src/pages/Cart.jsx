import React, { useEffect } from 'react'
import NavBar from '../components/LandingPage/NavBar'
import PendingOrders from '../components/Cart/PendingOrders'
import { useNavigate } from 'react-router-dom';
import OrderedProducts from '../components/Cart/OrderedProducts';

const Cart = () => {
  const auth_token = localStorage.getItem("auth_token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    if(role !== "user" || !auth_token){
      navigate('/login')
    }
  }, [])
  
  return (
    <>
        <NavBar />
        <PendingOrders />
        <OrderedProducts />
    </>
  )
}

export default Cart