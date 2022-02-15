const jwt = require("jsonwebtoken");
const Register = require("../models/user")

const auth = async(req,res,next)=>{
    try{
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token,"mynameissanthoshiamthirtyfiveyae");
        //console.log(verifyUser);
        const user = await Register.findOne({_id:verifyUser._id})
        //console.log(user);
        req.token = token;
        req.user = user;
       
        next();

    }catch(err){
        res.status(400).send(err);
    }
}

module.exports = auth;