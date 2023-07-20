const ApiResult = require("../middleware/error/ApiResult");
const jwt = require("jsonwebtoken");

let accessKey = process.env.JWT_ACCESS_KEY;
let refreshKey = process.env.JWT_REFRESH_KEY;

const generateAccessToken = (payload) => {
  const verifyOpts = {
    expiresIn: "30d",
  };
  const accessToken = jwt.sign(payload, accessKey, verifyOpts);
  return accessToken;
};

const generateRefreshToken = (payload) => {
  const verifyOpts = {
    expiresIn: "90d",
  };
  const refreshToken = jwt.sign(payload, refreshKey, verifyOpts);
  return refreshToken;
};

const refreshUserToken = async (req, res, next) => {
  try {
    
    const { refreshToken } = req.body;
    if (!refreshToken)
      return next(ApiResult.badRequest(`No refresh token provided`));
    let userPayload = jwt.verify(refreshToken, refreshKey);
    delete userPayload.exp
    console.log(`current user payload = `);
    console.log({userPayload});
    const accessToken = generateAccessToken(userPayload)
    const newRefreshToken = generateRefreshToken(userPayload)
    res.send({ accessToken: accessToken, refreshToken: newRefreshToken })
} catch (error) {
    next(ApiResult.badRequest(error.message));
  }
};

module.exports = { generateAccessToken, generateRefreshToken,refreshUserToken };
