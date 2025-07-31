const express = require('express');
const router = express.Router();
const {singUp,login,verifyOtp} = require('../../controllers/auth/auth.controller')

router.post('/singUp',singUp);
router.post('/login',login);
router.post('/verifyOtp',verifyOtp)

module.exports = router;