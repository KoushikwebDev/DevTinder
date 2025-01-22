const User = require("../models/user.schema");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");
const CustomError = require("../utils/customError");
const sendCommonResponse = require("../utils/sendCommonResponse");
const { default: AuthRoles } = require("../utils/authRoles");

// signup

exports.signup = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, gender } = req.body;

  const user = {
    firstName,
    lastName,
    email,
    password,
    gender,
  };
  for (const [key, value] of Object.entries(user)) {
    if (!value) {
      throw new CustomError(`${key} is required`, 400);
    }
  }
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new CustomError("User already exists", 400);
  }

  const newUser = await User.create(user);
  sendResponse(newUser, res);
});

// feed
exports.feed = asyncHandler(async (req, res) => {
  // const user = User.find({ isDeleted: false, role: AuthRoles.USER });
  const users = await User.aggregate([
    {
      $match: { isDeleted: false, role: AuthRoles.USER }, // Match users where isDeleted is false
    },
  ]); // get all users

  sendCommonResponse(users, res);
});
