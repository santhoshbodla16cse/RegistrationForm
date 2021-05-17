require('dotenv').config()
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const UserDetails = require('../models/userdetails');
const User = require('../models/user');

const auth = require("../middleware/auth")
const { check, validationResult } = require('express-validator');//express-validator


router.post('/details',async(req,res)=>{
    try{
        console.log("first step")
        const userDetails = new UserDetails({
        email :req.body.email,
        university : req.body.university,
        branch : req.body.branch,
        per_12 : req.body.per_12,
        per_10 : req.body.per_10
        })
        //console.log(u_id);
        const result =await userDetails.save();
        res.status(201).send("details filled successfully");
    }
    catch(e)
    {
        res.status(400).send(e);
    }
})

router.get('/details/specific',async(req,res)=>{
    
    try{
        let email = (req && req.body && req.body.email)|| "";
    //console.log(email)
    let userresults = UserDetails.find({email:email});
        userresults.exec(function(err,data){
            if(err) throw err;
            res.send(data);
        })

    }catch(e){
        res.status(400).send(e);
    }
})
router.get('/details',async(req,res)=>{
    
    try{
        
        const {page =1,limit=10,percent_limit = 60} = req.query;
        function filterBy12thpercent(item) {
            if (item.per_12>percent_limit) {
              return true
            }
          }
    //console.log(req.query)
  let userresults = await UserDetails.find()
  .limit(limit*1)
  .skip((page-1)*limit)//start index ,=>from that index then we need to print
  
          userresults = userresults.filter(filterBy12thpercent)
  res.json({total:userresults.length,userresults});
    //console.log(email)
    // let userresults = UserDetails.find({});
    //     userresults.exec(function(err,data){
    //         if(err) throw err;
    //         res.send(data);
    //     })

    }catch(e){
        res.status(400).send(e);
    }
})

module.exports = router;