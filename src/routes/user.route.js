const express = require("express");
const Router = express.Router();

const { signup } = require("../controllers/user.controller")

Router.post("/signup", signup);

module.exports = Router;