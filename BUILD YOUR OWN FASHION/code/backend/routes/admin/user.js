const express = require("express");
const conn = require("../../db");
const router = express.Router();

router.get('/userSummary', async (req, res) => {
    try {
        const db = await conn();
        const Orders = await db.collection("Orders");
        const usersWithOrderCount = await Orders.aggregate([
            {
                $group: {
                    _id: '$user_id',
                    pendingOrders: {
                        $sum: {
                            $cond: [{ $eq: ["$order_status", "Pending"] }, 1, 0]
                        }
                    },
                    numberOfTotalOrders: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'user_details',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'userInfo'
                }
            },
            {
                $unwind: '$userInfo'
            },
            {
                $project: {
                    user_id: '$_id',
                    username: '$userInfo.username',
                    email: '$userInfo.email',
                    pendingOrders: 1,
                    numberOfTotalOrders: 1
                }
            }
        ]).toArray();



        res.json({ success: true,msg:"Successful", data: usersWithOrderCount });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' ,error:error.message});
    }
});


/*to remove user */
router.delete('/removeUser/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const db = await conn();
        const User = await db.collection("user_details");
        const Order = await db.collection("Orders");
        
        const result = await User.deleteOne({ user_id: parseInt(userId) });
        const result2 = await Order.deleteMany({ user_id: parseInt(userId) });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: 'User removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});



module.exports = router;