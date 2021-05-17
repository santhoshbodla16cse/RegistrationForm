require('dotenv').config()
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')
const User = require('../models/user');
const auth = require("../middleware/auth")
const { check, validationResult } = require('express-validator');//express-validator
const { request } = require('express');

//Register
router.get('/register', function (req, res) {
  res.render('registration');
});

//Login
router.get('/login',function (req, res) {
  res.render('login');
});
//secret
router.get('/Secret',auth,function (req, res) {
 //console.log(`this is the cookie awesome ${req.cookies.jwt}`);
  res.render('Secret');
});
//logout
router.get('/logout',auth,async(req, res) =>{
  try{
    console.log("first step")
    //for single logout present user
    // req.user.tokens = req.user.tokens.filter((curr)=>{
    //   return curr.token !== req.token
    // })
    //console.log(req.user.tokens)
   // req.user.tokens =[] //for completely logout from all devices simply clean the array
  res.clearCookie("jwt");
    console.log("logout successfully")
    
    await req.user.save()
    res.render("login")
  }
  catch(e)
  {
    res.status(500).send(e);
  }
 });

router.post('/register', [
  // check() is used to validate each field of form according to the conditions
  check('email','Must be a valid email of 5 to 30 chars').isEmail().isLength({ min: 5 , max: 30}),
  check('password','Min 8 and Max 10 chars').isLength({ min: 8 , max: 10})
],async(req,res)=>{

  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If error occurs, handel it here    
    res.send(errors)
}
else{
   try{
    const email = req.body.email;
    const result = await User.findOne({email:email});
    if(result){
      res.send("email already exists")
    }
     const password = req.body.password;
     const cpassword = req.body.confirmpassword;
     if(password === cpassword){
      const user1 = new User({
        username :req.body.username,
        password : req.body.password,
        email : req.body.email,
        name : req.body.name,
        confirmpassword : req.body.confirmpassword
      })

      const token = await user1.generateAuthToken();
      console.log(token)
     
      res.cookie("jwt",token);//storing token in cookie, it has two props one is expires and other is http only so tht by any server side scripting lang u cant be able to del the cookie
      const result =await user1.save();
      console.log(result)
      res.status(201).render("index");
     }
     else
     {
       res.send("passwords are not matching")
     }
   }
   catch(error){
    res.status(400).send(error);
   }
  }
 })
 router.get('/delete_handlebars',(req,res)=>{
   res.render("delete")
 })
 router.get('/modify_handlebars',(req,res)=>{
  res.render("modify")
})
router.get('/View',(req,res)=>{
  res.render("view")
})
 router.post('/login',async(req,res)=>{
   try{
      const email = req.body.email;
      const password = req.body.password;

      const result = await User.findOne({email:email});
      //console.log(password)
     // console.log(result)
     // console.log(result.password)
      const isvalid = bcrypt.compare(password,result.confirmpassword);

      const token = await result.generateAuthToken();
     
      //console.log(token)
     
      res.cookie("jwt",token);

      // console.log(isvalid);
      // console.log(req.cookie.jwt)
      if(isvalid){
        if(email == "santhoshbodla98@gmail.com")
        res.status(201).render("admin_login_success");
        else
        res.status(201).render("login_success");
      }
      else{
        res.send("Invalid Login details")
      }
     

   }catch(err){
     res.status(400).send("invalid Login details");
   }
 })

 router.delete('/delete',async(req,res)=>{
   try{
    // console.log("first step")
    const deluser = await User.findByIdAndDelete(req.body.id);
    console.log(deluser)
    if(!req.body.id){
      return res.status(400).send()
    }
    else{
      if(deluser!==null){
      console.log("above Document Deleted");
      res.render("admin_login_success")
      }
      else
      {
        console.log("above Document Not present in database");
      res.send("above Document Not present in database")
      }
    }
   }
   catch(e){
     res.status(500).send(e);
   }
 })

 router.put('/update',async(req,res)=>{
   var _id = req.body.id;
   try{
    const result = await User.updateOne({_id},{
      $set : {
          username: req.body.username,
          name: req.body.name
      }
    });
    console.log(result);
    res.render("admin_login_success")
   }catch(e)
   {
    res.status(500).send(e);
   }
 })


 router.get('/details',async(req,res)=>{
    
  try{
     const {page =1,limit=10} = req.query;
    //console.log(req.query)
  let userresults = await User.find()
  .limit(limit*1)
  .skip((page-1)*limit);//start index ,=>from that index then we need to print
  
  //console.log(userresults.length)         
  res.json({total:userresults.length,userresults});
  }catch(e){
      res.status(400).send(e);
  }
})

module.exports = router;