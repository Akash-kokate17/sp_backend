const express = require("express");
const router = express.Router();
const serviceUpload = require("../../middleware/services_img_uploads/services.upload")
const {uploadService,getAllServices,modifyService,deleteService} = require("../../controllers/service/service.controller")

router.post("/uploadService",serviceUpload.single("serviceImgUpload"),uploadService); 
router.get("/getAllService",getAllServices); 
router.patch('/modifyService', serviceUpload.single('serviceImgUpload'), modifyService);
router.delete("/deleteService/:_id",deleteService); 

module.exports = router;