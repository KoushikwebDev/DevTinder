const User = require("../models/user.schema");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");
const CustomError = require("../utils/customError");
const sendCommonResponse = require("../utils/sendCommonResponse");
const AuthRoles = require("../utils/authRoles");

//* signup
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

//* get feed
exports.feed = asyncHandler(async (req, res) => {
  // const user = User.find({ isDeleted: false, role: AuthRoles.USER });
  const users = await User.aggregate([
    {
      $match: { isDeleted: false, role: AuthRoles.USER }, // Match users where isDeleted is false
    },
  ]); // get all users

  sendCommonResponse(users, res);
});

//? login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError("Email and Password are required", 400);
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new CustomError("Invalid email or password", 400);
  }
  const isValidatedPassword = await user.isValidatedPassword(password);

  if (!isValidatedPassword) {
    throw new CustomError("Invalid email or password", 400);
  }
  sendResponse(user, res);
});

//? get user profile 
exports.userProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if(!user){
    throw new CustomError("User not found", 404);
  };

  sendCommonResponse(user, res);
});

//? update user profile
exports.logout = asyncHandler(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    status: 200,
    success: true,
    message: "Logout successfully",
  });
})
