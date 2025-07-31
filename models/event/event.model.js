const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  eventType: {
    type: String,
    required: true,
  },
  orderDate: {
    type: Date,
    required: true,
  },
  eventBookingDate:{
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  serviceName: {
    type: String,
    required: true,
  },
  clientMsg: {
    type: String,
    maxlength: 100,
  },
  status:{
    type:String,
    default:'Pending'
  },
  sharpyCount:{
    type:String,
    required:true
  },
  ledScreenCount:{
     type:String,
    required:true
  }
});

const event = mongoose.model("events", eventSchema);

module.exports = event;
