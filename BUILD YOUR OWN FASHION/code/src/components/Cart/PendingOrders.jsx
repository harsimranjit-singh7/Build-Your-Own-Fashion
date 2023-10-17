import React, { useEffect, useState } from 'react'
import cartcss from '../../assets/styles/Cart.module.css'
import ProductCard from './PendingCard'

const PendingOrders = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
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

      } catch (error) {
        console.log("Error fetching pending orders:", error);
      }
    };



    fetchPendingOrders();
  }, [])



  /*To remove pending item from cart */
  const onRemove = (orderid) => {
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


  /*Finalizing orders */
  const placeOrder = (e) => {
    e.target.innerHTML = "Ordering...";
    const orderIds = [];
    pendingOrders.forEach((element, index) => {
      orderIds.push(element.order_id)
    });
    
    fetch(`http://localhost:5400/api/order/updateStatusToPlaced`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ orderIds })
    })
    .then(response => {
      if (response.ok) {
        setPendingOrders([]);
        e.target.innerHTML = "Place Order";
        return response.json();
        } else {
          throw new Error("Failed to update orders");
        }
      })
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }

  return (
    <div className={cartcss.container}>
      <div style={{ width: "inherit", display: "flex", justifyContent: "space-between" }}>
        <div className={cartcss.header}>Pending Orders:</div>
        <div style={{ display: "flex", gap: "15px", color: "white" }}>
          {/* <h4>$ { }</h4> */}
          <button className={cartcss.checkout_button} onClick={placeOrder}>Place Order</button>
        </div>
      </div>
      <div>
        {
          pendingOrders.map(order => (
            <ProductCard pendingOrder={order} key={order.order_id} orderDetails={order.order_details} product_details={order.product_details} RemoveHandler={onRemove} />
          ))
        }
      </div>
    </div>
  )
}

export default PendingOrders