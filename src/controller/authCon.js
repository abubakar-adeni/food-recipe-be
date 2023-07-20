const ApiResult = require("../middleware/error/ApiResult");
const {
  findUser,
  createUser,
  selectDataUserById,
  verifyUser,
} = require("./../model/userModel");
const { v4: uuidv4 } = require("uuid");
const argon2 = require("argon2");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../helpers/generateToken");
const email = require("../middleware/email");

const UsersController = {
  registerUser: async (req, res, next) => {
    if (!req.body.email || !req.body.password || !req.body.name) {
      next(
        ApiResult.badRequest(`Bad request, Email / Password / name missing`)
      );
      return;
    }
    console.log(`role = ${req.params.role}`);
    let role = req.params.role;
    //cek if email is registered
    let {
      rows: [users],
    } = await findUser(req.body.email);
    if (users) {
      next(ApiResult.unauthorized(`Email is registered, you may login.`));
      return;
    }

    // //create otp
    // let id = uuidv4();
    // let otp = Math.floor(100000 + Math.random() * 900000);
    // let data = {
    //   id,
    //   email: req.body.email,
    //   password: await argon2.hash(req.body.password),
    //   fullname: req.body.name,
    //   role,
    //   otp,
    // };

    let register = await createUser(data);

    if (!register) {
      next(ApiResult.unauthorized(`Registration failed`));
      return;
    }

    try {
      let url = `http://${process.env.BASE_URL}:${process.env.PORT}/auth/otp/${id}/${otp}`;
      let sendEmail = email(req.body.email, otp, url, req.body.name);
      if (sendEmail == "Email not sent") {
        return next(
          ApiResult.badRequest(`Registration failed, email was not sent`)
        );
      }
      return next(
        ApiResult.success(`Registration success, please check your email`)
      );
    } catch (error) {
      console.log("reg gagal", error);
      return next(ApiResult.badRequest(`Registration failed.`, error.message));
    }
  },

  loginUser: async (req, res, next) => {
    if (!req.body.email || !req.body.password) {
      next(ApiResult.badRequest(`Bad request, email / password missing.`));
      return;
    }

    //get users to check the data
    let {
      rows: [users],
    } = await findUser(req.body.email);
    if (!users) {
      return next(ApiResult.badRequest(`Login failed, wrong email / password`));
    }
    let verifyPassword = await argon2.verify(users.password, req.body.password);
    let data = users;
    delete data.password;
    let accessToken = generateAccessToken(data);
    let refreshToken = generateRefreshToken(data);

    if (verifyPassword) {
      users.accessToken = accessToken;
      users.refreshToken = refreshToken;
      delete users.password;
      delete users.otp;
      delete users.created_at;
      if(!users.verified){
        return next(ApiResult.badRequest(`Login failed, please check your email to verify`));
      }
      return next(ApiResult.success(`Login successful, welcome ${users.fullname}`, users));
    }

    return next(ApiResult.badRequest(`Login failed`));
  },
  otpUser: async (req, res, next) => {
    let id = req.params.id;
    let otp = req.params.code;

    if (!id || !otp) {
      return next(ApiResult.badRequest(`Wrong OTP, please enter correct OTP`));
    }

    let {
      rows: [users],
    } = await selectDataUserById(id);

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
  }
};

module.exports = UsersController;
