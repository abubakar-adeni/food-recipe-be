const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getAllUsers,
  getUserById,
  putDataUser,
  changePassword,
} = require("./../controller/usersCon");
const { upload } = require("../middleware/upload");
router.get("/", getAllUsers);
router.get("/myprofile", protect, getUserById);
router.put("/update", upload.single("photo"), protect, putDataUser);
router.post('/resetPassword', changePassword)
module.exports = router;
