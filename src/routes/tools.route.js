const express = require("express");
const Router = express.Router();

const { ocr } = require("../controllers/tools.controller");

Router.post("/ocr", ocr);

module.exports = Router;