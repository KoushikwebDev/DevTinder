const User = require("../models/user.schema");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");
const CustomError = require("../utils/customError");

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
