//2.2) Route handlers - users
const User = require("../models/userModul");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400,
      ),
    );
  }
  // 2) Filtered out unwanted fields names that are not allowed to be updated
  // body.role: "admin" --- not allowed
  const filteredBody = filterObj(req.body, "name", "email");
  // 3) Update the user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  // In userModul.js you can find this.find({ active: { $ne: false } }); set in the pre middleware /^find/

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

// It's actualy deactivate the account setting active to false
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};

//This must be like this because the update is happening in sign up
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined! Please use sign up instead",
  });
};

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
// DO NOT update passwords with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
