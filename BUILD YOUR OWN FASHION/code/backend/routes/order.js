const express = require('express');
const router = express.Router();
const Joi = require('joi');
const conn = require('../db');
const sessionChecker = require('../middleware.js/sessionChecker');



router.get('/pendingCount', sessionChecker, async (req, res) => {
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
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});

router.post('/addtocart', sessionChecker, async (req, res) => {
    try {
        const database = await conn();
        const order_collection = await database.collection("Orders");
        const orderDetail_collection = await database.collection("OrderDetails");
        const { selectedColor, selectedSize, quantity, product_id, unit_price, selectedStyle } = req.body.orderDetails;
        const schema = Joi.object({
            selectedColor: Joi.string()
                .pattern(/^[A-Za-z]+$/)
                .required(),

            selectedSize: Joi.string().required(),
            unit_price: Joi.number().required(),
            quantity: Joi.number().required()
            // address: Joi.string().pattern(/^[A-Za-z0-9\s\-.,/]+$/)
            //     .message('address may contain hyphen, fullstop, slash, comma, and no other special character').required(),

            // pincode: Joi.string()
            //     .pattern(/^[A-Z0-9]{6}$/)
            //     .required(),

            // city: Joi.string()
            //     .pattern(/^[A-Za-z\s]+$/)
            //     .required(),
        });

        // Validate
        const result = schema.validate({
            selectedColor,
            selectedSize,
            unit_price: parseFloat(unit_price),
            quantity: parseInt(quantity)
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
            // address: '',
            // city: '',
            // state: '',
            // pincode: '',
            product_id,
            selectedColor,
            quantity,
            selectedSize,
            selectedStyle: selectedStyle || "",
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



/* api to get placed orders */
router.post('/orders/placed',sessionChecker, async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(userId)
        const db = await conn();
        const Order = await db.collection("Orders");

        const orders = await Order.aggregate([
            {
                $match: {
                    user_id: parseInt(userId), // assuming user_id is stored as a number
                    order_status: "Placed"
                }
            },
            {
                $lookup: {
                    from: "OrderDetails",
                    localField: "order_id",
                    foreignField: "order_id",
                    as: "orderDetails"
                }
            },
            {
                $lookup: {
                    from: "Products",
                    localField: "orderDetails.product_id",
                    foreignField: "product_id",
                    as: "productDetails"
                }
            },
            {
                $lookup: {
                    from: "order_shipped_details",
                    localField: "order_id",
                    foreignField: "order_id",
                    as: "shippingDetails"
                }
            },
            {
                $unwind: "$productDetails"
            },
            {
                $group: {
                    _id: "$_id",
                    orderData: { $first: "$$ROOT" },
                    products: { $push: "$productDetails" }
                }
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: ["$orderData", "$$ROOT"]
                    }
                }
            },
            {
                $project: {
                    orderData: 0
                }
            }
        ]).toArray();

        if (!orders || orders.length === 0) {
            return res.status(404).json({ success: false, message: "No placed orders found for this user" });
        }

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});




router.get('/pendingOrders', sessionChecker, async (req, res) => {
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
        res.status(200).json({ success: true, msg: "Successful", results });
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

        res.status(200).send({ success: true, msg: 'Successfully deleted order and its details.' });
    } catch (error) {
        res.status(500).send({ success: false, msg: 'Failed to delete order.', error: error.message });
    }
});


router.post('/updateStatusToPlaced', async (req, res) => {
    const orderSchema = Joi.object({
        orderIds:Joi.array().required(),
        shippingAddress: Joi.string().required(),
        city: Joi.string().required(),
        stateProvince: Joi.string().required(),
        postalCode: Joi.string().required(),
        country: Joi.string().required(),
        creditCardNumber: Joi.string().creditCard().required(),
        nameOnCard: Joi.string().required(),
        cvv: Joi.string().length(3).pattern(/^[0-9]+$/).required(),
        expiryMonth: Joi.string().length(2).pattern(/^[0-9]+$/).required(),
        expiryYear: Joi.string().length(2).pattern(/^[0-9]+$/).required()
    });

    const validationResult = await orderSchema.validate(req.body);
    if (validationResult.error) {
        return res.status(400).send({ success: false, message: validationResult.error.details[0].message });
    }
    try {
        const orderIds = req.body.orderIds;
        const db = await conn();

        const result = await db.collection('Orders').updateMany(
            { order_id: { $in: orderIds } },
            { $set: { order_status: "Placed" } }
        );

        const documents = req.body.orderIds.map(element => ({
            order_id: element,
            shippingAddress:req.body.shippingAddress,
            city:req.body.city,
            stateProvince:req.body.stateProvince,
            postalCode:req.body.postalCode,
            country:req.body.country,
            payment: "Online"
        }));
        
        // Use insertMany to insert all documents in a single operation
        const result2 = await db.collection("order_shipped_details").insertMany(documents);
        if(result2){
            return res.status(200).json({ success: true, message: 'Orders updated successfully'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error',error:error.message });
    }
});


module.exports = router;