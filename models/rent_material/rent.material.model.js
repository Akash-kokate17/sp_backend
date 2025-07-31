const mongoose = require("mongoose");

const rentMaterialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNo: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  addressProofType: { type: String, required: true },
  sharpyLightCount: { type: Number, required: true },
  ledScreenCount: { type: Number, required: true },
  // price: { type: Number, required: true },
  clientNote: { type: String ,default:''},
  fileName: { type: String }, 
  rentDate:{type:Date,required:true},
  createdAt: { type: Date, default: Date.now },
  status:{type:String,default:"Pending"}
});

module.exports = mongoose.model("rentmaterials", rentMaterialSchema);
