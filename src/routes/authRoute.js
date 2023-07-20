const express = require('express')
const router = express.Router()
const {registerUser,loginUser,otpUser} = require('./../controller/authCon')
const {cekRole} = require('../middleware/auth')
const {refreshUserToken} = require('../helpers/generateToken')

router.post('/register/:role', cekRole, registerUser)
router.post('/login',loginUser)
router.get('/otp/:id/:code',otpUser)
router.post('/refresh-token/', refreshUserToken)

module.exports = router