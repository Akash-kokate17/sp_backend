const express = require('express');
const router = express.Router();
const {adminLogin,verifyOtpAdmin} = require("../../controllers/admin/admin.controller")


router.post('/adminLogin',adminLogin)
router.post('/adminVerifyOtp',verifyOtpAdmin)

module.exports = router;