const ApiResult = require("../middleware/error/ApiResult");
const cloudinary = require("../config/uploadconfig");
const mailer = require("../middleware/email");
const argon2 = require("argon2");
// next(ApiResult.[tiperesult](message,data));
const {
  selectDataUser,
  insertDataUser,
  selectDataUserById,
  updateDataUser,
  deleteDataUser,
  findUser,
  checkOTP,
  changePassword,
  verifyUser,
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
  //getuser versi then catch
  // getUserById: async (req, res, next) => {
  //   if (isNaN(req.params.id)) {
  //     next(ApiResult.badRequest(`Bad Request, id is not a number`));
  //   }
  //   await selectDataUserById(req.params.id).then((result)=>{
  //     if(!result.rows[0]){
  //       next(ApiResult.badRequest(`Data not found`));
  //     }
  //     res
  //     .status(200)
  //     .json({ status: 200, message: `Data found`, data: result.rows });
  //   }).catch((error)=>{
  //     next(ApiResult.badRequest(error.message));
  //   })
  // },

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
        // if(!req.isFileValid){
        //     return res.status(404).json({status:404,message:`${req.isFileValidMessage || `No file detected / file type invalid`}`})
        // }
        req.body.photo = users.photo;
      } else {
        // console.log('req valid',req.isFileValid)
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

      //cek if undefined
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
  getOTPbyEmail: async (req, res, next) => {
    try {
      let email = req.body.email;
      if (!email) {
        res.status(404).json({ msg: "Please input email" });
      }
      let {
        rows: [users],
      } = await findUser(email);
      if (!users) {
        res
          .status(400)
          .json({ msg: `Failed get user. email ${email} doesn't exist` });
      }
      const data = {
        otp: users.otp,
        email: email,
      };
      try {
        let sendEmail = mailer(users.email, users.otp);
        if (sendEmail == "email not send") {
          res
            .status(404)
            .json({ status: 404, message: `Failed to send email` });
        } else {
          res
            .status(200)
            .json({ msg: "Email sent, check your email", data: data });
        }
      } catch (error) {
        res
          .status(400)
          .json({
            where: `Error sending otp`,
            msg: error.message,
            data: error.data,
          });
      }
      // console.log(response);
    } catch (error) {
      next(error.message);
    }
  },
  verifyEmailOTP: async (req, res, next) => {
    try {
      if (!req.body.email || !req.body.otp) {
        res
          .status(404)
          .json({ status: 404, message: `Please fill your email and OTP` });
      } else {
        let data = {
          email: req.body.email,
          otp: req.body.otp,
        };
        let result = await checkOTP(data);
        if (result.rows.length === 0) {
          res
            .status(404)
            .json({
              status: 404,
              message: `OTP is incorrect, please check again`,
            });
        } else {
          res
            .status(200)
            .json({
              status: 200,
              message: `Confirm OTP success`,
              data: result.rows,
            });
        }
      }
    } catch (error) {
      next(error.message);
    }
  },
  otpUser: async (req, res, next) => {
    let email = req.body.email;
    let otp = req.body.otp;

    if (!email || !otp) {
      return next(ApiResult.badRequest(`Wrong OTP, please enter correct OTP`));
    }

    let {
      rows: [users],
    } = await findUser(email);
    let id = users.id
    if (!users) {
      return next(ApiResult.badRequest(`User was not found`));
    }

    console.log(users.otp, otp);
    if (users.otp == otp) {
      let verif = await verifyUser(id);
      if (verif) {
        return next(ApiResult.success(`User verified successfully`));
      } else {
        return next(ApiResult.badRequest(`User verification failed`));
      }
    } else {
      return next(ApiResult.badRequest(`Wrong OTP, please enter correct OTP`));
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
