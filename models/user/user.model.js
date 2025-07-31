const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
    required: true,
  },
  password:{
    type:String,
    required:true,
  },
  role:{
    type:String,
    required:true
  },
  otp:{
    type:String,
  },
  otpExpire:{
    type:Date,
  }
});

const User = mongoose.model('users',userSchema)

module.exports = User
