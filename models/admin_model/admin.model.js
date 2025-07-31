const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  phoneNo: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
  role:{
    type:String,
    default:'admin'
  },
  otp:{
    type:String,
    default:null
  },
  otpExpires:{
    type:Date,
    default:null
  }
});

const Admin = mongoose.model('admin_',adminSchema);

module.exports = Admin;
