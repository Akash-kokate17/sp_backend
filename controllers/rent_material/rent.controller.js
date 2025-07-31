const rentMaterial = require("../../models/rent_material/rent.material.model");
const nodemailer = require("nodemailer");
require("dotenv").config();

const postRentMaterial = async (req, res) => {
  try {
    const {
      name,
      phoneNo,
      email,
      address,
      addressProofType,
      sharpyLightCount,
      ledScreenCount,
      // price,
      clientNote,
      rentDate,
    } = req.body;
    if (
      !name ||
      !phoneNo ||
      !email ||
      !address ||
      !addressProofType
      // ||
      // price == null
    ) {
      return res.status(400).json({
        message: "Please fill all required fields.",
        name,
        phoneNo,
        email,
        address,
        addressProofType,
        price,
      });
    }

    const rentOrderDate = new Date(rentDate);
    rentOrderDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (rentOrderDate < today) {
      return res
        .status(401)
        .send({ success: false, msg: "you can't enter past date" });
    }

    const preventOrderLimitDate = new Date(today);
    preventOrderLimitDate.setDate(today.getDate() + 30);

    if (rentOrderDate > preventOrderLimitDate) {
      return res.status(400).send({
        success: false,
        msg: "Bookings can only be made up to 30 days in advance",
      });
    }

    const nextDate = new Date(rentOrderDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const dateAvailable = await rentMaterial.findOne({
      rentDate: {
        $gte: rentOrderDate,
        $lt: nextDate,
      },
      status: { $nin: ["Pending", "Cancelled"] },
    });

    if (dateAvailable) {
      return res.status(400).send({
        success: false,
        msg: `The date ${rentOrderDate.toDateString()} is already booked. Please choose another date.`,
      });
    }

    const fileName = req.file ? req.file.filename : null;

    const newOrder = new rentMaterial({
      name,
      phoneNo,
      email,
      address,
      addressProofType,
      sharpyLightCount: parseInt(sharpyLightCount),
      ledScreenCount: parseInt(ledScreenCount),
      // price,
      clientNote,
      fileName,
      rentDate: rentOrderDate,
    });

    await newOrder.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_KEY,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: `${email}`,
      subject: `${name} your order for rent equipment is confirmed and we rich soon to you`,
      html: `
     <div>
      <p>Thank you for your order. We'll contact you shortly to confirm the details.</p>
          <p><strong>Note:</strong> Extra charges may apply for distant locations.</p>
          <p style="font-size: 14px; color: #888;">- SP_Light_Screen Team</p>
     </div>
    `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email send error:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(201).json({
      message: "Rent material order placed successfully.",
      data: newOrder,
      success: true,
    });
  } catch (error) {
    console.error("Error creating rent order:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getRentOrderUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({ msg: "email is required" });
    }

    const rentOrder = await rentMaterial.find({ email });

    if (rentOrder.length === 0 || !rentOrder) {
      return res.send({ msg: "No order" });
    }

    res.status(200).send({ msg: "rent order fetch successfully", rentOrder });
  } catch (error) {
    console.log("something went wrong to fetch rent order");
    res.status(500).send({ msg: "error to fetch rent order" });
  }
};

const fetchAllRentOrder = async (req, res) => {
  try {
    const allRentOrder = await rentMaterial.find({});
    if (!allRentOrder || allRentOrder.length === 0) {
      res.status(400).send({ msg: "there is no rent order" });
    }

    res
      .status(200)
      .send({ msg: "rent order fetch successfully", allRentOrder });
  } catch (error) {
    console.log("something went wrong to fetch all rent order");
    res.status(500).send({ msg: "server error to fetch rent order" });
  }
};

const updateRentStatus = async (req, res) => {
  try {
    const { _id,status } = req.body;

    if (!status || !_id) {
      return res.status(400).send({
        msg: "plz proved status and id",
        statusUpdate: false,
      });
    }
    const userRentOrder = await rentMaterial.findById(_id);

    if (!userRentOrder) {
      return res
        .status(404)
        .send({ msg: "User rent order not found", statusUpdate: false });
    }

    userRentOrder.status = status;
    await userRentOrder.save();

    res.status(200).send({
      msg: "user status updated successfully ",
      statusUpdate: true,
      userRentOrder,
    });
  } catch (error) {
    console.log("error to update rent status",error);
    return res.status(500).send({
      msg: "Server error while updating rent status.",
      statusUpdate: false,
    });
  }
};
module.exports = {
  postRentMaterial,
  getRentOrderUser,
  fetchAllRentOrder,
  updateRentStatus,
};
