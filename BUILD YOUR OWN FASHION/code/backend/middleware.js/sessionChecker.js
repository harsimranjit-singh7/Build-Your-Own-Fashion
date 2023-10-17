const jwt = require("jsonwebtoken");
const JWT_SECRET = "thunderb0y";

const sessionChecker = (req,res,next) =>{
    //get user from jwt token and add id to req object
    var token = req.header('auth_token');
    if(!token){
        return res.status(401).json({ success: false, redirect: '/login', authorized: false });
    }
    try {
        const data = jwt.verify(token,JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, redirect: '/login', authorized: false });
    }
}
module.exports = sessionChecker;