import React, { useEffect, useState } from 'react'
import cartcss from '../../assets/styles/Cart.module.css'
import modalcss from '../../assets/styles/Modal.module.css'
import ProductCard from './PendingCard'
import CheckOutModal from './CheckOutModal'

const PlacedOrders = () => {
  const [placedOrders, setPlacedOrders] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [complete,setComplete] = useState(false);

  /*for closing and opening the details for placing order*/
  const [open, setOpen] = useState(false);
  const toggleModal = () => {
    if(placedOrders.length === 0 && open === false){
      alert("Don't have any pending orders!")
      setOpen(open => !open);
    }else{
      setOpen(open => !open);
    }
  }

  useEffect(() => {
    const fetchPlacedOrders = async () => {
      const auth_token = localStorage.getItem("auth_token");
      try {
        const response = await fetch('http://localhost:5400/api/order/placedOrders', {
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
        setPlacedOrders(data.results);

      } catch (error) {
        console.log("Error fetching pending orders:", error);
      }
    };



    fetchPlacedOrders();
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
        setPlacedOrders(placedOrders.filter(e => { return e.order_id !== orderid }));

      })
      .catch(error => {
        console.error("Error:", error);
      });
  }


  /*Finalizing orders */
  // const placeOrder = (e) => {
  //   e.target.innerHTML = "Ordering...";
  //   const orderIds = [];
  //   placedOrders.forEach((element, index) => {
  //     orderIds.push(element.order_id)
  //   });

  //   fetch(`http://localhost:5400/api/order/updateStatusToPlaced`, {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({ orderIds })
  //   })
  //     .then(response => {
  //       if (response.ok) {
  //         setPlacedOrders([]);
  //         e.target.innerHTML = "Place Order";
  //         return response.json();
  //       } else {
  //         throw new Error("Failed to update orders");
  //       }
  //     })
  //     .then(data => {
  //       console.log(data);
  //     })
  //     .catch(error => {
  //       console.error("Error:", error);
  //     });
  // }



  return (
    <div className={cartcss.placed_orders_container}>
      <div style={{ width: "inherit", display: "flex", justifyContent: "space-between" }}>
        <div className={cartcss.placed_orders_header}>Pending Orders:</div>
        <div style={{ display: "flex", gap: "15px", color: "white" }}>
          {/* <h4>$ { }</h4> */}
          <button onClick={toggleModal} className={cartcss.checkout_button}>Place Order</button>
        </div>
      </div>
      <div className={cartcss.cartcontainer}>
        {
          placedOrders.map(order => (
            <ProductCard pendingOrder={order} key={order.order_id} orderDetails={order.order_details} product_details={order.product_details} RemoveHandler={onRemove} />
          ))
        }
      </div>
      {
        open ?
          <div className={modalcss.main_body}>
            <div onClick={toggleModal} className={modalcss.modal_background}>
            </div>
            <CheckOutModal toggleModal={toggleModal} complete={complete}/>
          </div>
          :
          <>
          </>
      }
    </div>
  )
}

export default PlacedOrders