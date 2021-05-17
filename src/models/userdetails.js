const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Userdetails Schema
const UserDetailsSchema = new mongoose.Schema({
  
    email: {
      type: String,
      required: true
    },
    university: {
      type: String,
      required : true
    },
    branch: {
      type: String,
      required : true
    },
    per_12: {
      type: Number,
      required : true
    },
    per_10:{
      type:Number,
      required : true
    }
  });

const UserDetails = new mongoose.model('UserDetails', UserDetailsSchema);
module.exports = UserDetails;