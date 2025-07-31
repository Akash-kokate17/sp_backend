const Event = require("../../models/event/event.model");
const nodemailer = require("nodemailer");
require("dotenv").config();

const eventController = async (req, res) => {
  try {
    const {
      name,
      phoneNo,
      email,
      eventType,
      location,
      serviceName,
      eventBookingDate,
      clientMsg,
      sharpyCount,
      ledScreenCount,
    } = req.body;

    if (
      !name ||
      !phoneNo ||
      !email ||
      !eventType ||
      !location ||
      !eventBookingDate ||
      !sharpyCount ||
      !ledScreenCount
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    const eventDate = new Date(eventBookingDate);
    eventDate.setHours(0, 0, 0, 0); // cover hours 00:00:00
    // to prevent past booking

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (eventDate < today) {
      return res.status(400).send({
        success: false,
        message: "Cannot book an event in the past.",
      });
    }

    // maxAdvanceDate for user can only book withIn 30 days only from start date
    const maxAdvanceDate = new Date(today);
    maxAdvanceDate.setDate(today.getDate() + 30);
    if (eventDate > maxAdvanceDate) {
      return res.status(400).send({
        success: false,
        msg: "Bookings can only be made up to 30 days in advance",
      });
    }

    // check event book on that day already

    const nextDay = new Date(eventDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const existingBooking = await Event.findOne({
      eventBookingDate: {
        $gte: eventDate,
        $lt: nextDay,
      },
      status:{$nin:["Pending", "Cancelled","Completed"]}
    });
    if (existingBooking) {
      return res.status(400).send({
        msg: `The date ${eventDate.toDateString()} is already booked. Please choose another date.`,
      });
    }

    const eventDateBooking = new Date();

    const newEventOrder = new Event({
      name,
      phoneNo,
      email,
      eventType,
      orderDate: eventDateBooking,
      location,
      serviceName,
      eventBookingDate: eventDate,
      clientMsg,
      status: "Pending",
      ledScreenCount,
      sharpyCount,
    });

    await newEventOrder.save();

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
      subject: `${name} We will connect to you as soon as possible`,
      html: `
         <div>
      <h5>Your order has been confirmed. We will contact you shortly to discuss the details and payment.</h5>
      <br/>
      <p style="font-size: 14px; color: #888;">- SP_Light_Screen Team</p>
    </div>
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send({
          msg: "something went wrong to send mail for event order user",
        });
      }
      console.log("Email sent:", info.response);
    });

    return res.status(201).send({
      mailSend: true,
      msg: "Mail sent successfully. Event order received successfully.",
      eventOrder: newEventOrder,
    });
  } catch (error) {
    console.log("something went wrong in eventController");
    res.send({ msg: "something went wrong in eventController" });
  }
};

const getEvent = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send({ msg: "Email is required" });
    }

    const eventOrder = await Event.find({ email });

    if (eventOrder.length === 0) {
      return res
        .status(404)
        .send({ msg: "No event orders found for this email" });
    }

    res
      .status(200)
      .send({ msg: "your event order fetch successfully", eventOrder });
  } catch (error) {
    console.log("something went wrong to get event order");
    return res
      .status(500)
      .send({ msg: "something went wrong to get event order" });
  }
};

const getAllEventOrder = async (req, res) => {
  try {
    const allEventOrder = await Event.find({});

    if (!allEventOrder || allEventOrder.length === 0) {
      return res.status(400).send({ msg: "there is not event order" });
    }

    res
      .status(200)
      .send({ msg: "all event order fetch successfully", allEventOrder });
  } catch (error) {
    console.log("something went wrong to fetch all rent event");
    res.status(500).send({ msg: "sever error to fetch event order" });
  }
};

const updateEventStatus = async (req, res) => {
  try {
    const { _id,status } = req.body;

    if (!status || !_id) {
      return res.status(400).send({
        msg: "plz provide status and id",
        statusUpdate: false,
      });
    }

    const userEventOrder = await Event.findOne({ _id: _id });

    if (!userEventOrder) {
      return res
        .status(404)
        .send({ msg: "User rent order not found", statusUpdate: false });
    }

    userEventOrder.status = status;
    await userEventOrder.save();

    res.status(201).send({
      msg: "user status updated successfully ",
      statusUpdate: true,
      userEventOrder,
    });
  } catch (error) {
    console.log("error to update rent status",error);
    return res.status(500).send({
      msg: "Server error while updating status",
      statusUpdate: false,
    });
  }
};

module.exports = {
  eventController,
  getEvent,
  getAllEventOrder,
  updateEventStatus,
};
