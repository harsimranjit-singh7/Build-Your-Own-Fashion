const express = require('express');
const router = express.Router();
const Joi = require('joi');
const conn = require('../db');
const sessionChecker = require('../middleware.js/sessionChecker');



router.get('/pendingCount',sessionChecker, async (req, res) => {
    try {
        const userId = parseInt(req.user.id); // Assuming user_id is a number, else remove parseInt()

        const db = await conn();
        const count = await db.collection('Orders').countDocuments({
            user_id: userId,
            order_status: "Pending"
        });

        res.status(200).json({ success: true, pendingOrdersCount: count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' ,error:error.message});
    }
});

router.post('/addtocart', sessionChecker, async (req, res) => {
    try {
        const database = await conn();
        const order_collection = await database.collection("Orders");
        const orderDetail_collection = await database.collection("OrderDetails");
        const { selectedColor, selectedSize, address, pincode, city, quantity, product_id, unit_price } = req.body.orderDetails;
        const schema = Joi.object({
            selectedColor: Joi.string()
                .pattern(/^[A-Za-z]+$/)
                .required(),

            selectedSize: Joi.string().required(), // Add more constraints if necessary

            address: Joi.string().pattern(/^[A-Za-z0-9\s\-.,/]+$/)
                .message('address may contain hyphen, fullstop, slash, comma, and no other special character').required(),

            pincode: Joi.string()
                .pattern(/^[A-Z0-9]{6}$/)
                .required(),

            city: Joi.string()
                .pattern(/^[A-Za-z\s]+$/)
                .required(),
        });

        // Validate
        const result = schema.validate({
            selectedColor,
            selectedSize,
            address,
            pincode,
            city,
        });

        if (result.error) {
            return res.status(400).json({ success: false, msg: result.error.details[0].message });
        }

        let maxOrderId = await order_collection.find().sort({ order_id: -1 }).limit(1).toArray();
        const newOrderId = parseInt(maxOrderId[0].order_id) + 1;

        const orderAck = await order_collection.insertOne({
            order_id: newOrderId,
            user_id: req.user.id,
            total_price: quantity * unit_price,
            order_status: 'Pending',
            order_date: new Date()
        });


        let maxOrderDetailsId = await orderDetail_collection.find().sort({ order_detail_id: -1 }).limit(1).toArray();
        const newOrderDetailsID = parseInt(maxOrderDetailsId[0].order_detail_id) + 1;
        const orderDetailsAck = await orderDetail_collection.insertOne({
            order_detail_id: newOrderDetailsID, // Determine how you'd like to generate this
            order_id: newOrderId,
            address,
            city,
            pincode,
            product_id,
            selectedColor,
            quantity,
            selectedSize,
            unit_price
        });

        if (orderDetailsAck && orderAck) {
            return res.status(200).json({ success: true, msg: "Order placed into Cart!" })
        }
    } catch (err) {
        console.log("Internal Server error" + err)
        return res.json({ success: false, error: "Internal Server error" });
    }
});


router.get('/pendingOrders',sessionChecker, async (req, res) => {
    try {
        const database = await conn();
        const Orders = await database.collection("Orders");
        // const userId = req.user.id; 
        const userId = req.user.id; 
        
        const pipeline = [
            {
                $match: {
                    user_id: userId,  // Replace with desired user_id
                    order_status: "Pending"
                }
            },
            {
                $lookup: {
                    from: "OrderDetails",
                    localField: "order_id",
                    foreignField: "order_id",
                    as: "order_details"
                }
            },
            {
                $unwind: "$order_details"
            },
            {
                $lookup: {
                    from: "Products",
                    localField: "order_details.product_id",
                    foreignField: "product_id",
                    as: "product_details"
                }
            },
            {
                $unwind: "$product_details"
            }
        ]

        const results = await Orders.aggregate(pipeline).toArray();
        res.status(200).json({success:true,msg:"Successful",results});
    } catch (err) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
})


router.delete('/removeOrder/:order_id', async (req, res) => {
    const orderID = req.params.order_id;
    const database = await conn();
    const Orders = await database.collection("Orders");
    const OrderDetail = await database.collection("OrderDetails");
    try {
        await Orders.deleteOne({ order_id: parseInt(orderID) });

        await OrderDetail.deleteMany({ order_id: parseInt(orderID) });

        res.status(200).send({ success:true,msg: 'Successfully deleted order and its details.' });
    } catch (error) {
        res.status(500).send({ success:false,msg: 'Failed to delete order.', error: error.message });
    }
});


router.put('/updateStatusToPlaced', async (req, res) => {
    try {
        const orderIds = req.body.orderIds;
        const db = await conn();
        
        const result = await db.collection('Orders').updateMany(
            { order_id: { $in: orderIds } },
            { $set: { order_status: "Placed" } }
        );

        res.status(200).json({ success: true, message: 'Orders updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


module.exports = router;