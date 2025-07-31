const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Users = require("../../models/user/user.model");
const nodemailer = require("nodemailer");
require("dotenv").config();

const singUp = async (req, res) => {
  try {
    const { name, email, phoneNo, password } = req.body;
    const user = await Users.findOne({ phoneNo: phoneNo });
    if (user) {
      return res.status(200).send({ msg: `user already registered` });
    }
    const hashPass = bcrypt.hashSync(password, 8);
    const newUser = new Users({
      name: name,
      phoneNo: phoneNo,
      email: email,
      password: hashPass,
      role: "user",
      otp: null,
    });

    await newUser.save();
    res.status(201).send({ msg: "user register successfully", newUser });
  } catch (error) {
    res.send(error, "something went wrong");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    if (!user) {
      return res.send({ msg: "user is not exist" });
    }
    const correctPass = bcrypt.compareSync(password, user.password);
    if (!correctPass) {
      return res.send({ msg: "password is not matched" });
    } else {
      const token = jwt.sign({ user: user._id }, process.env.MYSECRET_KEY, {
        expiresIn: "7d",
      });
      user.otp = generateOtp();
      user.otpExpire = Date.now() + 5 * 60 * 1000;
      await user.save();

      // send mail code

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
        subject: "Your One Time Otp Password From Sp_Light_Screen",
        html: `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #333;">Hello,</h2>
      <p>Your one-time password (OTP) is:</p>
      <h1 style="color: #007BFF; font-size: 36px;">${user.otp}</h1>
      <p>This OTP will expire in <strong>5 minutes</strong>. Do not share it with anyone.</p>
      <br />
      <p style="font-size: 14px; color: #888;">- SP_Light_Screen Team</p>
    </div>
  `,
      };

      transport.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.error("Error sending email:", error);
        }
        console.log("Email sent:", info.response);
      });

      res.send({
        userPass: true,
        token: token,
        msg: "OTP sent successfully",
        otpMail: true,
        _id: user._id,
        email: user.email,
      });
    }
  } catch (error) {
    res.send({ msg: "something went wrong" });
    console.log("something went wrong");
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await Users.findOne({ email });
    if (!email) {
      return res.send({ msg: "user is not valid" });
    }
    if (!user.otp || user.otpExpire < Date.now()) {
      return res.send({ msg: "OTP has expired. Please Login again." });
    }
    if (otp !== user.otp) {
      return res.send({ msg: "otp not matched" });
    }
    user.otp = null;
    user.otpExpire = null;
    await user.save();
    res.send({ verified:true, msg: "user otp matched" });
  } catch (error) {
    res.send({ msg: "something went wrong in verify otp" });
    console.log(error, "something went wrong in verify otp");
  }
};

// function for generate otp

function generateOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

module.exports = { singUp, login, verifyOtp };
