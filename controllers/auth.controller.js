const createError = require("http-errors");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const newUser = new User({
      email,
      password,
    });
    
     const exisitingUser = await User.findOne({ email });
    if (exisitingUser) {
      throw createError.BadRequest("Email already registered.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    newUser.password = hashedPassword;

    await newUser.save();
    res.status(200).json({
      success: true,
      msg: "Account created",
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ email: email }).select("password");

    if (!foundUser) {
      throw createError("Email not registerd");
    }

    const validUser = await bcrypt.compare(password, foundUser.password);

    if (validUser === true) {
      const user = await User.findOne({ email });
      res.status(200).json({
        success: true,
        msg: "Logged In",
        data: user,
      });
    } else {
      throw createError.Unauthorized("Invalid credentials");
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
