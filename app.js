const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoute = require("./routes/auth_routes/auth.routes");
const adminRoute = require("./routes/admin_route/admin.route");
const eventRoute = require("./routes/event_route/event.route");
const rentRoute = require("./routes/rent_route/rent.route");
const service = require("./routes/serviceUploads/serviceUploads.route");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth/", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/event/", eventRoute);
app.use("/api/rent/", rentRoute);
app.use("/api/service/", service);

app.use("/uploads", express.static("uploads"));
app.use("/serviceUploadsImg", express.static("serviceUploadsImg"));

module.exports = app;
