const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
// User Schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required : true
  },
  email: {
    type: String,
    required : true
  },
  name: {
    type: String,
    required : true
  },
  confirmpassword:{
    type:String,
    required : true
  },
  tokens:[{
    token:{
      type:String,
      required : true
    }
  }]
});

//token creation
UserSchema.methods.generateAuthToken = async function(){
  try{
    const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({token:token});
    await this.save(); //after adding the token to the above tokens field we neeed to call the save method again to store data in db, it return promise so we await
    return token;
  }catch(err){
    res.send("the error part is  "+ err);
    console.log("the error part is  "+ err);
  }
}


//crypting the passoword
UserSchema.pre("save",async function(next){
  this.password = await bcrypt.hash(this.password,9);
  this.confirmpassword = await bcrypt.hash(this.password,9);

  next();
})



const User = new mongoose.model('User', UserSchema);
module.exports = User;