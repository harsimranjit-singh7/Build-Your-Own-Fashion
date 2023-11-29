import React, { useEffect, useState } from 'react';
import styles from '../../assets/styles/OrderedProducts.module.css';
import { Image } from 'cloudinary-react';

const OrderedProducts = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const auth_token = localStorage.getItem("auth_token");
            const response = await fetch('http://localhost:5400/api/order/orders/placed', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "auth_token": auth_token
                }
            });

            const data = await response.json();
            if (data.success) {
                console.log(data.orders)
                setOrders(data.orders);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Your Orders:</h2>
            {orders.map((order, index) => (
                <div key={index} className={styles.orderCard}>
                    <div className={styles.orderHeader}>
                        <span className={styles.orderId}>Order ID: {order.order_id}</span>
                        <span className={styles.orderDate}>Order Date: {new Date(order.order_date).toLocaleDateString()}</span>
                    </div>
                    <div className={styles.productDetails}>
                        <Image
                            cloudName="dxahez5ol"
                            publicId={
                                `${order.productDetails.product_name +order.productDetails.product_id+ "/styles/" + order.orderDetails[0].selectedColor + order.orderDetails[0].selectedStyle} `?
                                `ecomm/${order.productDetails.product_name +order.productDetails.product_id+ "/styles/" + order.orderDetails[0].selectedColor + order.orderDetails[0].selectedStyle}`
                                :
                                `ecomm/${order.productDetails.product_images[0]}`
                            }
                            crop="fill"
                            alt="product_img"
                            className={styles.productImage}
                        />
                        <div className={styles.productInfo}>
                            <h3>{order.products[0].product_name}</h3>
                            <p>{order.products[0].product_desc}</p>
                            <p>Color: {order.orderDetails[0].selectedColor}</p>
                            <p>Size: {order.orderDetails[0].selectedSize}</p>
                            <p>Quantity: {order.orderDetails[0].quantity}</p>
                        </div>
                    </div>
                    <div className={styles.orderFooter}>
                        <span className={styles.totalPrice}>Total Price: ${order.total_price}</span>
                        <span className={styles.orderStatus}>Status: {order.order_status}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrderedProducts;
