const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getAllUsers,
  getUserById,
  putDataUser,
  getOTPbyEmail,
  verifyEmailOTP,
  changePassword,
  otpUser,
} = require("./../controller/usersCon");
const { upload } = require("../middleware/upload");
router.get("/", getAllUsers);
router.get("/myprofile", protect, getUserById);
router.put("/update", upload.single("photo"), protect, putDataUser);
router.post('/otp' , getOTPbyEmail)
router.post('/verify', otpUser)
router.post('/otp/confirm' , verifyEmailOTP)
router.post('/resetPassword', changePassword)
module.exports = router;
