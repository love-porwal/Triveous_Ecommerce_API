const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user.model");
require("dotenv").config();
const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with a name, email, and password.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               name: John Doe
 *               email: johndoe@example.com
 *               password: secretPassword
 *     responses:
 *       200:
 *         description: User registered successfully.
 *       409:
 *         description: User already registered with this email.
 *       500:
 *         description: Something went wrong.
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user with email and password and return a JWT token.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: johndoe@example.com
 *               password: secretPassword
 *     responses:
 *       200:
 *         description: User login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 Token:
 *                   type: string
 *       401:
 *         description: User not found or authentication failed.
 *       500:
 *         description: Something went wrong.
 */

userRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // user previously register or not
    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      return res
        .status(409)
        .json({ msg: "User Already Register with this email" });
    }
    // hash the password
    const hashpassword = await bcrypt.hash(password, 7);
    // New user model
    const user = new UserModel({
      name,
      email,
      password: hashpassword,
    });

    await user.save();
    res.status(200).json({ msg: "User Register Sucessfully" });
  } catch (error) {
    res.status(500).json({ msg: "Something went Wrong" });
  }
});

// login
userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: "User not Found!" });
    }
    // compare hash password
    const passcomp = await bcrypt.compare(password, user.password);
    if (!passcomp) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // jwt token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.Secret_Key,
      { expiresIn: "2h" }
    );
    res.status(200).json({ msg: "User Login SucessFully", Token: token });
  } catch (error) {
    res.status(500).json({ msg: "Something went Wrong" });
  }
});

module.exports = { userRouter };
