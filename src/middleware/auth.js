const jwt = require("jsonwebtoken");
const ApiResult = require("../middleware/error/ApiResult");
let accessKey = process.env.JWT_ACCESS_KEY;

const protect = (req, res, next) => {
  try {
    let accessToken;
    if (req.headers.authorization) {
      let auth = req.headers.authorization;
      accessToken = auth.split(" ")[1];
      let decode = jwt.verify(accessToken, accessKey);
      req.payload = decode;
      next();
    } else {
      next(ApiResult.badRequest(`Server accesss token not found, please login`));
      return;
    }
  } catch (error) {
    if (error && error.name == "JsonWebTokenError") {
      next(ApiResult.badRequest(`Login failed, server token invalid`, error.message));
      return;
    } else if (error && error.name == "TokenExpiredError") {
      next(ApiResult.badRequest(`Login failed, server token expired`,error.message));
      return;
    } else {
      next(ApiResult.badRequest(`Login failed, please try again`,error.message));
      return;
    }
  }
};

const cekRole = (req,res,next) => {
  if(req.params.role == 'admin' || req.params.role == 'user' ){
      return next()
  }
  return res(res, 404, false, null,"Invalid user role")
}

module.exports = { protect,cekRole};