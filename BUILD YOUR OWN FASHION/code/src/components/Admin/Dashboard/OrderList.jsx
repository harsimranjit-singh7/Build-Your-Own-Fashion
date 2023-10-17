import React from 'react';
import dashboardcss from '../../../assets/styles/AdminStyles/dashboard.module.css'

function OrderList({ orders }) {
    console.log(orders)
    return (
        <>
        <h3 style={{margin:"20px 130px 20px"}}>Order Details: </h3>
        <table className={dashboardcss.order_table}>
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Product Name</th>
                    <th>Product Color</th>
                    <th>Product Size</th>
                    <th>Quanitity</th>
                    <th>User</th>
                    <th>Order Date</th>
                    <th>Status</th>
                    <th>Total Amount</th>
                </tr>
            </thead>
            <tbody>
                {orders.map(order => (
                    <tr key={order.order_id}>
                        <td>{order.order_id}</td>
                        <td>{order.ProductName}</td>
                        <td>{order.ProductColor}</td>
                        <td>{order.ProductSize}</td>
                        <td>{order.Quantity}</td>
                        <td>{order.User}</td>
                        <td>{order.Date}</td>
                        <td>{order.OrderStatus}</td>
                        <td>${order.TotalAmount}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        </>
    );
}

export default OrderList;
