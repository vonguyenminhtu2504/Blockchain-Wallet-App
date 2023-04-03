const express = require("express");

const router = express.Router();

const argon2 = require("argon2");

const jwt = require("jsonwebtoken");

const User = require("../models/User");

// @route POST api/auth/register
// @description Register a user
// @access public
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // simple validation
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing username or password!" });
  }

  try {
    // Check if the user is already registered
    const user = await User.findOne({ username: username });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "Username already taken!" });
    }

    // All good
    const hashedPassword = await argon2.hash(password);
    const newUser = new User({ username: username, password: hashedPassword });
    await newUser.save();

    // Return token
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    return res.status(200).json({
      success: true,
      message: "User registered successfully!",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
});

// @route POST api/auth/login
// @description Login
// @access Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // simple validation
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing username or password!" });
  }

  try {
    // Check for existing user
    const user = await User.findOne({ username: username });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect username!" });
    }

    // username found
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password!" });
    }

    // All good
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    return res.status(200).json({
      success: true,
      message: "User logged in successfully!",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
});

module.exports = router;
