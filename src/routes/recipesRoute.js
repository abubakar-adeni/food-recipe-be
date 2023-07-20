const express = require("express");
const router = express.Router();
const {
  getAllRecipes,
  postDataRecipe,
  getRecipeById,
  putDataRecipe,
  deleteDataRecipe,
  getRecipeByRecipeId,
  countRecipe,
  countMyRecipe
} = require("./../controller/recipesCon");
const { protect } = require("../middleware/auth");
const { upload } = require("../middleware/upload");

router.get("/", protect, getAllRecipes);
router.get("/my-recipe", protect, getRecipeById);
router.get("/count-recipe", countRecipe);
router.get("/count-my-recipe",protect, countMyRecipe);
router.get("/:id",protect,getRecipeByRecipeId)
router.post("/", protect, upload.single("photo"), postDataRecipe);
router.put("/:id", protect, upload.single("photo"), putDataRecipe);
router.delete("/:id", protect, deleteDataRecipe);

module.exports = router