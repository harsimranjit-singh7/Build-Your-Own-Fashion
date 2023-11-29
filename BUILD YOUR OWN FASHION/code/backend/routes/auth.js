const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const conn = require('../db');
const JWT_SECRET = 'thunderb0y';

//create user api
router.post('/register', async (req, res) => {
    try {

        const database = await conn();
        const user_details = await database.collection("user_details");
        const { email, password, username } = req.body;
        /* getting connection */
        //validation of user input (email,username,password); 
        const schema = Joi.object({
            username: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).required(),
        });

        const result = schema.validate({ username, email, password });
        if (result.error) {
            res.status(400).json({ success: false, error: result.error.details[0].message });
            return;
        }

        //check weather same email user exits or not
        let user = await user_details.findOne({ email: req.body.email });

        if (user) {
            return res.status(400).json({ success: false, error: "User already exists!!" });
        }

        let username_check = await user_details.findOne({ username });
        if (username_check || username === "admin") {
            return res.status(400).json({ success: false, error: "Username already exists!!" });
        }

        let salt = await bcrypt.genSalt(10);
        let secPass = await bcrypt.hash(req.body.password, salt);


        let newID = await user_details.find().sort({ user_id: -1 }).limit(1).toArray();
        newID = parseInt(newID[0].user_id)+1;
        //sending request to save user details to database;


        user = await ({
            user_id:newID,
            username: username,
            email: email,
            password: secPass,
            created_at: new Date(Date.now()),
            last_login: new Date(Date.now()),
        })
        let insertedUser = await user_details.insertOne(user);
        if(insertedUser){
            const data = {
                user: {
                    id: newID,
                    role:"user"
                }
            }
            const authtoken = jwt.sign(data, JWT_SECRET);
            req.session.cookie.authToken = authtoken;
            req.session.user = user;
            return res.status(200).json({success:true,msg:"Successful",authtoken,user});
        }
    }
    catch (error) {
        console.log("Error: " + error);
        res.status(500).json({ success: false, error: 'Some Error occured',error:error.message });
    }
})

//login auth api
router.post('/login', async (req, res) => {
    /*establishing connection*/

    if (req.method === "POST") {
        const database = await conn();
        const user_details = await database.collection("user_details");
        const { email, password } = req.body;
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        });

        const result = schema.validate({ email: req.body.email, password: req.body.password });
        if (result.error) {
            res.status(400).json({ success: false, error: result.error.details[0].message });
            return;
        }

        if(email==="admin@gmail.com" && password === "admin"){
            const user = {
                email:"admin@gmail.com",
                role:"admin",
                username:"admin"
            }
            const data = {
                user: {
                    id: email,
                    role:"admin"
                }
            }

            const authtoken = jwt.sign(data, JWT_SECRET);
            return res.status(200).json({success:true,msg:"Successful",authtoken,user,role:"admin"});
        }
        try {
            let user = await user_details.findOne({ email });

            if (!user) {
                return res.status(400).json({ success: false, error: "Wrong credentials" });
            }

            let passwordCompare = await bcrypt.compare(password, user.password);

            if (!passwordCompare) {
                return res.status(400).json({ success: false, error: "Wrong credentials" });
            }

            const data = {
                user: {
                    id: user.user_id,
                    role:"user"
                }
            }

            const authtoken = jwt.sign(data, JWT_SECRET);
            req.session.user = user;
            req.session.cookie.authToken = authtoken;
            return res.status(200).json({success:true,msg:"Successful",authtoken,user,role:"user"});
        } catch (error) {
            console.log("Error: " + error);
            res.status(500).json({ success: false, error: 'Internal server Error!' });
        }
    }
})

module.exports = router;