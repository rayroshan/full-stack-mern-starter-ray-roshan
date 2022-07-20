class HttpError extends Error {
  constructor(message, errorCode) {
    super(message);
    this.code = errorCode;
    this.message = message;
  }
}

module.exports = HttpError;
