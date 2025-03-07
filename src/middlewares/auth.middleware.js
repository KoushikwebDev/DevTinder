
const asyncHandler = require("../utils/asyncHandler");
const CustomError = require("../utils/customError");
const JWT = require("jsonwebtoken");
const config = require("../config");
const User = require("../models/user.schema");

const isLoggedIn = asyncHandler(async (req, _res, next) => {
  let token;

  if (
    req.cookies.token ||
    (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer"))
  ) {
    token = req.cookies.token || req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new CustomError("Not authorized to access this route", 401);
  }

  try {
    const decodedJwtPayload = JWT.verify(token, config.JWT_SECRET);

    //_id, find user based on id, set this in req.user
    req.user = await User.findById(decodedJwtPayload.id, "name email role");
    next();

  } catch (error) {
    throw new CustomError("Not authorized to access this route", 401);
  }
});

module.exports = isLoggedIn;