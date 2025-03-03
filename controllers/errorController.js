const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const regex = /dup key: { name: "([^"]+)" }/;
  const match = err.errmsg.match(regex);

  const message = `Duplicate field value: "${match[1]}". Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  if (!err.errors) {
    return new AppError("Invalid input data.", 400);
  }

  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again!", 401);

const sendErrorProd = (err, res) => {
  //Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    //Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error("Error 💥", err);
    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = JSON.parse(JSON.stringify(err)); // Deep clone
    error.message = err.message;
    error.name = err.name;
    error.stack = err.stack;
    error.code = err.code;
    error.errmsg = err.errmsg;
    if (err.errors) error.errors = err.errors;

    console.log("Error Object:", error);

    if (error.errors) {
      console.log(
        Object.values(error.errors)
          .map((el) => el.message)
          .join(", "),
      );
    }

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError" && error.errors)
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};
