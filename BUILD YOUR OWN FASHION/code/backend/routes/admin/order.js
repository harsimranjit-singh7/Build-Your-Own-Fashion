const express = require('express');
const conn = require('../../db');
const router = express.Router();


router.get('/orderSummary', async (req, res) => {
    try {
        // Fetch all orders
        const db = await conn();
        const Order = await db.collection("Orders")
        const OrderDetail = await db.collection("OrderDetails")
        const Product = await db.collection("Products")
        const UserDetails = await db.collection("user_details")


        const orders = await Order.find().toArray();

        const summaries = await Promise.all(orders.map(async (order) => {
            const orderDetail = await OrderDetail.findOne({ order_id: parseInt(order.order_id) });
            const product = await Product.findOne({ product_id: parseInt(orderDetail.product_id) });
            const userDetails = await UserDetails.findOne({ user_id: order.user_id });
            console.log(orderDetail.product_id + " " +userDetails)
            return {
                order_id: order.order_id,
                Date: order.order_date,
                ProductName: product.product_name,
                ProductColor: orderDetail.selectedColor,
                ProductSize: orderDetail.selectedSize,
                Quantity: orderDetail.quantity,
                User: userDetails.email ,
                OrderDate: order.order_date,
                City: orderDetail.city,
                OrderStatus: order.order_status,
                TotalAmount: order.total_price
            };
        }));

        res.json({ success: true,msg:"Successful", data: summaries });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


router.get('/dashboardStats', async (req, res) => {
    try {
        const db = await conn();

        const totalUsers = await db.collection('user_details').countDocuments();
        const totalOrders = await db.collection('Orders').countDocuments();
        const placedOrders = await db.collection('Orders').countDocuments({ order_status: 'Placed' });
        const pendingOrders = await db.collection('Orders').countDocuments({ order_status: 'Pending' });

        const stats = {
            totalUsers,
            totalOrders,
            placedOrders,
            pendingOrders
        };

        res.status(200).json({ success: true, stats });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});


module.exports = router;