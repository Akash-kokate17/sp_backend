const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../../models/admin_model/admin.model");
require("dotenv").config();
const nodemailer = require("nodemailer");

// function for create otp

function generateOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

const adminLogin = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      return res
        .status(401)
        .send({ msg: "admin not found", admin: false, admin });
    }
    // const hashedPassword = bcrypt.hashSync("admin123", 8);
    const passwordCheck = bcrypt.compareSync(password, admin.password);

    if (!passwordCheck) {
      return res.status(401).send({ msg: "password not matched" });
    }
    const token = jwt.sign(
      { admin: admin._id },
      process.env.MYSECRET_KEY_ADMIN,
      { expiresIn: "7d" }
    );

    admin.otp = generateOtp();
    admin.otpExpires = Date.now() + 5 * 60 * 1000;
    await admin.save();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_KEY,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: `${email}`,
      subject: "Admin your One Time Otp Password From Sp_Light_Screen",
      html: `
       <div style="font-family: Arial, sans-serif; padding: 20px;">
         <h2 style="color: #333;">Hello,</h2>
         <p>Your one-time password (OTP) is:</p>
         <h1 style="color: #007BFF; font-size: 36px;">${admin.otp}</h1>
         <p>This OTP will expire in <strong>5 minutes</strong>. Do not share it with anyone.</p>
         <br />
         <p style="font-size: 14px; color: #888;">- SP_Light_Screen Team</p>
       </div>
     `,
    };

    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("something went wrong to send mail", error);
        return res.status(500).send({ msg: "Failed to send OTP email" });
      }
      console.log("mail send successfully", info.response);
    });

    res
      .status(201)
      .send({ msg: "admin login successfully", otp: true, token, email });
  } catch (error) {
    console.log("something went wrong in admin login");
    res.status(500).send({ msg: "Internal server error" });
  }
};

const verifyOtpAdmin = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).send({ msg: "Admin not found" });
    }

    if(!otp){
      return res.status(400).send({msg:'plz enter 4 digit otp'})
    }

    if (!admin.otp || admin.otpExpires < new Date()) {
      admin.otp = null;
      admin.otpExpires = null;
      await admin.save();
      return res
        .status(410)
        .send({ msg: "OTP has expired. Please request a new one." ,otpExpires:true});
    }

    if (otp !== admin.otp) {
      return res.status(401).send({ msg: "OTP not matched" });
    }

    admin.otp = null;
    admin.otpExpires = null;
    await admin.save();

    res.send({ otp: "verified", msg: "Admin OTP matched", admin: true, admin });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).send({ msg: "Internal server error" });
  }
};

module.exports = { adminLogin, verifyOtpAdmin };
