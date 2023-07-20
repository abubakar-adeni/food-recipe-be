class ApiResult {
  constructor(code, message,data) {
    this.code = code;
    this.message = message;
    this.data = data;
  }

  static badRequest(msg,data) {
    return new ApiResult(400, msg, data);
  }
  static unauthorized(msg,data) {
    return new ApiResult(401, msg, data);
  }
  static internal(msg,data) {
    return new ApiResult(500, msg, data);
  }

  static success(msg,data) {
    return new ApiResult(200, msg, data);
  }
  static createSuccess(msg,data) {
    return new ApiResult(201, msg, data);
  }
}

module.exports = ApiResult;
