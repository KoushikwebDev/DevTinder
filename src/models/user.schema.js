const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const crypto = require("crypto");
const config = require("../config/index");
const { default: AuthRoles } = require("../utils/authRoles");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      max: 20,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      max: 10,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 20,
      select: false,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    role: {
      type : String,
      enum: Object.values(AuthRoles),
      default: "USER",  
    },
    forgetPasswordToken: String,
    forgetPasswordExpiry: Date,
  },
  { timestamps: true }
);

// Encrypt Password Before Save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
});

// user methods

userSchema.methods = {
  // validate password  with passed on user password
  isValidatedPassword: async function (userSendPassword) {
    return await bcrypt.compare(userSendPassword, this.password); // it gives true/false
  },

  // create and return JWT token
  getJwtToken: async function () {
    return JWT.sign(
      {
        id: this._id,
        email: this.email,
        role: this.role,
      },
      config.JWT_SECRET,
      {
        expiresIn: config.JWT_EXPIRES_TIME,
      }
    );
  },

  //   generate ForgotPassword Token
  getForgotPasswordToken: function () {
    // generate long and random string
    const forgotToken = crypto.randomBytes(20).toString("hex");

    // getting a hash - make sure to get a hash on backend
    this.forgotPasswordToken = crypto
      .createHash("sha256")
      .update(forgotToken)
      .digest("hex");

    // time of token
    this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;

    return forgotToken;
  },
};

module.exports = mongoose.model("User", userSchema);
