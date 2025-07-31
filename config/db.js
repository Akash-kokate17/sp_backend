const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const Admin = require("../models/admin_model/admin.model");

async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
  } catch (error) {
    console.log(error, "db connect to fail");
  }
}
module.exports = connectDb;
