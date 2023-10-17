const express = require('express');
const router = express.Router();
const conn = require('../db');
const sessionChecker = require('../middleware.js/sessionChecker');

router.post('/',sessionChecker,async(req,res)=>{
    try{
        const {limit} = req.body;
        const database = await conn();
        const product_collection = await database.collection("Products");
        if(typeof limit === "number"){
            const products = await product_collection.find().limit(limit).toArray();
            res.status(200).json({success:200,msg:"Successful",products});
        }else{
            const products = await product_collection.find().toArray();
            res.status(200).json({success:200,msg:"Successful",products});
        }
    }catch(err){
        res.status(500).json({success:false,error:"Internal Server Error!"});
    }
})

module.exports=router;