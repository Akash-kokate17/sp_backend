const mongoose = require("mongoose");

const ServicesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  btn: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  sharpyCount: {
    type: String,
    default: "",
  },
  ledScreenCount: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    required: true,
  },
  serviceImgUpload: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
});

const Service = mongoose.model("services", ServicesSchema);

module.exports = Service;
