import React, { useEffect, useState } from 'react'
import cartcss from '../../assets/styles/Cart.module.css'
import modalcss from '../../assets/styles/Modal.module.css'
import ProductCard from './PendingCard'
import CheckOutModal from './CheckOutModal'
import { Link } from 'react-router-dom'

const PendingOrders = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  /*for closing and opening the details for placing order*/
  const [open, setOpen] = useState(false);
  const toggleModal = () => {
    if (pendingOrders.length === 0 && open === false) {
      alert("Don't have any pending orders!")
    } else {
      setOpen(open => !open);
    }
  }

  useEffect(() => {
    const fetchPendingOrders = async () => {
      const auth_token = localStorage.getItem("auth_token");
      try {
        const response = await fetch('http://localhost:5400/api/order/pendingOrders', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth_token": auth_token
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setPendingOrders(data.results);
        console.log(pendingOrders)

        const totalPriceSum = data.results.reduce((sum, element) => sum + element.total_price, 0);
        setTotalPrice(Math.abs(totalPriceSum).toFixed(2));

      } catch (error) {
        console.log("Error fetching pending orders:", error);
      }
    };



    fetchPendingOrders();
  }, [])



  /*To remove pending item from cart */
  const onRemove = (orderid) => {
    const order = pendingOrders.filter(e => e.order_id === orderid);
    setTotalPrice(t => Math.abs(t - order[0].total_price).toFixed());
    fetch(`http://localhost:5400/api/order/removeOrder/${orderid}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to delete order");
        }
      })
      .then(data => {
        setPendingOrders(pendingOrders.filter(e => { return e.order_id !== orderid }));

      })
      .catch(error => {
        console.error("Error:", error);
      });
  }



  return (
    <>
      <div className={cartcss.container}>
        <div style={{ width: "inherit", display: "flex", justifyContent: "space-between" }}>
          <div className={cartcss.header}>Pending Orders:</div>
          <div style={{ display: "flex", gap: "15px", color: "white" }}>
            <h4>Total Order Of : ${totalPrice}</h4>
            <button onClick={toggleModal} className={cartcss.checkout_button}>Place Order</button>
          </div>
        </div>
        {
          pendingOrders && pendingOrders.length > 0 ?
            <div className={cartcss.cartcontainer}>
              {
                pendingOrders.map(order => (
                  <ProductCard pendingOrder={order} key={order.order_id} orderDetails={order.order_details} product_details={order.product_details} RemoveHandler={onRemove} />
                ))
              }
            </div>
            :
            <div style={{ display: 'flex', flexDirection: "column", height: "100%", width: "100%", justifyContent: "center", alignItems: "center" ,color:"white"}}>
              <h3 style={{color:"white"}}>Hey!! Go browse some of our best Items!</h3>
              <button style={{ border: "1px solid white", backgroundColor: "#004945", color: "white", padding: "10px 15px", borderRadius: "15px" }}>
                <Link style={{width:"100%", color: "white", textDecoration: "none" }} to={"/"} >Browse</Link>
              </button>
            </div>
        }
        {
          open ?
            <div className={modalcss.main_body}>
              <div onClick={toggleModal} className={modalcss.modal_background}>
              </div>
              <CheckOutModal pendingOrders={pendingOrders} toggleModal={toggleModal} totalAmount={totalPrice}/>
            </div>
            :
            <>
            </>
        }
      </div>
    </>
  )
}

export default PendingOrders