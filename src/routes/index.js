const express = require("express");
const router = express.Router();
const Users = require("./usersRoute");
const Recipes = require("./recipesRoute");
const Categories = require("./categoriesRoute")
const Auth = require("./authRoute")

router.use("/users", Users);
router.use("/recipes", Recipes);
router.use("/categories", Categories);
router.use("/auth", Auth);

module.exports = router;
