const ApiResult = require("../middleware/error/ApiResult");
const {
  findUser,
  createUser,
} = require("./../model/userModel");
const { v4: uuidv4 } = require("uuid");
const argon2 = require("argon2");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../helpers/generateToken");

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
    // Cek apakah email sudah terdaftar
    let {
      rows: [users],
    } = await findUser(req.body.email);
    if (users) {
      next(ApiResult.unauthorized(`Email is registered, you may login.`));
      return;
    }

    let id = uuidv4();
    let passwordHash = await argon2.hash(req.body.password);
    let data = {
      email: req.body.email,
      fullname: req.body.name,
      password: passwordHash,
      otp: '', 
      id: id,
      role: role,
    };
    let register = await createUser(data);

    if (!register) {
      next(ApiResult.unauthorized(`Registration failed`));
      return;
    }

    return next(
      ApiResult.success(`Registration success`)
    );
  },

  loginUser: async (req, res, next) => {
    if (!req.body.email || !req.body.password) {
      next(ApiResult.badRequest(`Bad request, email / password missing.`));
      return;
    }


    let {
      rows: [users],
    } = await findUser(req.body.email);
    if (!users) {
      return next(ApiResult.badRequest(`Login failed, wrong email / password`));
    }


    let verifyPassword = await argon2.verify(users.password, req.body.password);
    let data = users;
    delete data.password;


    if (verifyPassword) {
      users.accessToken = generateAccessToken(data);
      users.refreshToken = generateRefreshToken(data);
      delete users.password;
      delete users.otp;
      delete users.created_at;

      return next(ApiResult.success(`Login successful, welcome ${users.fullname}`, users));
    }

    return next(ApiResult.badRequest(`Login failed`));
  },
};

module.exports = UsersController;
