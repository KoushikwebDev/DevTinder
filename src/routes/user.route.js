const express = require("express");
const Router = express.Router();

const { signup, feed, login, userProfile, logout } = require("../controllers/user.controller");
const isLoggedIn = require("../middlewares/auth.middleware");

/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: User signup
 *     description: Creates a new user account.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - gender
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The first name of the user.
 *                 example: John
 *               lastName:
 *                 type: string
 *                 description: The last name of the user.
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user.
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: The password for the user account.
 *                 example: strongPassword123
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *                 description: The gender of the user.
 *                 example: Male
 *     responses:
 *       201:
 *         description: User successfully signed up.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique ID of the created user.
 *                   example: 63e3c9f0e4b0c9001a123456
 *                 firstName:
 *                   type: string
 *                   example: John
 *                 lastName:
 *                   type: string
 *                   example: Doe
 *                 email:
 *                   type: string
 *                   example: john.doe@example.com
 *                 gender:
 *                   type: string
 *                   example: Male
 *       400:
 *         description: Bad request due to validation errors or user already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message.
 *                   example: User already exists
 *       500:
 *         description: Server error
 */
Router.post("/signup", signup);

/**
 * @swagger
 * /user/feed:
 *   get:
 *     summary: Get all active users
 *     description: Retrieve all users where `isDeleted` is false and the role is `USER`.
 *     tags: 
 *       - User
 *     responses:
 *       200:
 *         description: List of users retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique ID of the user.
 *                         example: 63e3c9f0e4b0c9001a123456
 *                       firstName:
 *                         type: string
 *                         description: The first name of the user.
 *                         example: John
 *                       lastName:
 *                         type: string
 *                         description: The last name of the user.
 *                         example: Doe
 *                       email:
 *                         type: string
 *                         format: email
 *                         description: The email of the user.
 *                         example: john.doe@example.com
 *                       role:
 *                         type: string
 *                         description: The role of the user.
 *                         example: USER
 *                       isDeleted:
 *                         type: boolean
 *                         description: Indicates if the user is deleted.
 *                         example: false
 *       400:
 *         description: Bad request due to invalid query parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   description: The error message.
 *                   example: Invalid request
 *       500:
 *         description: Server error.
 */
Router.get("/feed", feed);


Router.post("/login", login);

Router.get("/getProfile", isLoggedIn, userProfile);

Router.get("/logout", logout);



module.exports = Router;
