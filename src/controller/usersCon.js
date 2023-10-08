const ApiResult = require("../middleware/error/ApiResult");
const cloudinary = require("../config/uploadconfig");
const argon2 = require("argon2");
const {
  selectDataUser,
  insertDataUser,
  selectDataUserById,
  updateDataUser,
  deleteDataUser,
  findUser,
  changePassword,
} = require("../model/userModel");

const usersController = {
  getAllUsers: async (req, res, next) => {
    try {
      let { searchBy, search, sortBy, sort } = req.query;
      let data = {
        searchBy: searchBy || "fullname",
        search: search || "",
        sortBy: sortBy || "fullname",
        sort: sort || "DESC",
      };
      data.page = parseInt(req.query.page) || 1;
      data.limit = parseInt(req.query.limit) || 10;
      data.offset = (data.page - 1) * data.limit;
      let showUser = await selectDataUser(data);
      if (showUser.rows.length === 0) {
        next(
          ApiResult.badRequest(
            `Data not Found, user with ${data.searchBy} = ${data.search} does not exist`
          )
        );
        return;
      }
      next(ApiResult.success(`Data found`, showUser.rows));
    } catch (error) {
      next(ApiResult.badRequest(`Error, message: ${error.message}`));
    }
  },

  getUserById: async (req, res, next) => {
    try {
      let id = req.payload.id;
      console.log(id);
      let {
        rows: [users],
      } = await selectDataUserById(id);
      if (!users) {
        next(ApiResult.badRequest(`Bad Request, data user not found`));
        return;
      }
      next(ApiResult.success(`Data found`, users));
    } catch (error) {
      next(ApiResult.badRequest(`Error, message = ${error.message}`));
    }
  },

  postDataUser: async (req, res, next) => {
    try {
      let data = {};
      data.name = req.body.name;
      data.email = req.body.email;
      data.phonenumber = req.body.phonenumber;
      data.password = req.body.password;
      let result = await insertDataUser(data);
      if (!result) {
        next(ApiResult.badRequest(`Failed to insert user data`));
        return;
      }
      next(ApiResult.success(`Data user inserted`));
    } catch (error) {
      next(ApiResult.badRequest(error.message));
    }
  },

  putDataUser: async (req, res, next) => {
    try {
      let id = req.payload.id;
      let {
        rows: [users],
      } = await selectDataUserById(id);
      if (!users) {
        next(ApiResult.badRequest(`User with id ${id} does not exist`));
        return;
      }
      if (!req.file) {
        req.body.photo = users.photo;
      } else {
        if (!req.isFileValid) {
          return res
            .status(404)
            .json({
              status: 404,
              message: `${req.isFileValidMessage || `File type invalid`}`,
            });
        }
        const imageUrl = await cloudinary.uploader.upload(req.file.path, {
          folder: "recipes_images",
        });
        if (!imageUrl) {
          next(
            ApiResult.badRequest(`Update data failed, failed to upload photo`)
          );
        }
        req.body.photo = imageUrl.secure_url;
      }

      let data = {
        fullname: req.body.fullname || users.fullname,
        email: req.body.email || users.email,
        photo: req.body.photo || users.photo,
      };
      let result = await updateDataUser(id, data);
      if (!result) {
        next(ApiResult.badRequest(`Update data user failed`));
        return;
      }
      let checkData = await selectDataUserById(id);
      next(ApiResult.success(`Update data successful`, checkData.rows));
    } catch (error) {
      next(ApiResult.badRequest(error.message));
    }
  },

  deleteDataUser: async (req, res, next) => {
    try {
      let id = req.params.id;
      let {
        rows: [users],
      } = await selectDataUserById(id);
      if (!users) {
        next(ApiResult.badRequest(`User with id ${id} does not exist`));
        return;
      }
      let result = await deleteDataUser(id);
      if (!result) {
        next(ApiResult.badRequest(`Delete data user failed`));
        return;
      }
      next(ApiResult.success(`Delete data user successful`, `${id} deleted`));
    } catch (error) {
      next(ApiResult.badRequest(error.message));
    }
  },

  changePassword: async (req, res, next) => {
    try {
      if (!req.body.email || !req.body.password || !req.body.confirm) {
        res
          .status(400)
          .json({ status: 400, message: `Please fill the required fields.` });
      }
      if (req.body.password != req.body.confirm) {
        res
          .status(400)
          .json({ status: 400, message: `Confirmed password is incorrect` });
      }

      let data = {
        email: req.body.email,
        password: await argon2.hash(req.body.password),
      };
      let result = await changePassword(data);
      console.log(result);
      if (!result) {
        res.status(404).json({ status: 404, message: `Password reset failed` });
      } else {
        res
          .status(200)
          .json({ status: 200, message: `Password reset successful` });
      }
    } catch (error) {
      next(error.message);
    }
  },
};

module.exports = usersController;
