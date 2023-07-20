const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  postDataCategory,
  getCategoryById,
  putDataCategory,
  deleteDataCategory,
} = require("./../controller/categoriesCon");

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.post("/", postDataCategory);
router.put("/:id", putDataCategory);
router.delete("/:id", deleteDataCategory);
module.exports = router;
