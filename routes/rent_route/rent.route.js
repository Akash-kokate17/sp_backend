const express = require("express");
const router = express.Router();
const upload = require("../../middleware/upload.js/upload")
const {postRentMaterial, getRentOrderUser,fetchAllRentOrder,updateRentStatus} = require("../../controllers/rent_material/rent.controller")

// "fileName" this i have to give in input filed as a name="fileName"
router.post("/sendRentMaterial",upload.single("fileName"),postRentMaterial)
router.post("/rentOrderUser",getRentOrderUser);
router.get("/allRentOrder",fetchAllRentOrder);
router.patch("/updateRentStatus",updateRentStatus)

module.exports = router;