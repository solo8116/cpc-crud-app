const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const validator = require("email-validator");
const BlacklistToken = require("../models/logout");

const spassword = (password) => {
  try {
    const hashedPassword = bcryptjs.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
};

const gentoken = async (id) => {
  try {
    const token = jwt.sign({ _id: id }, process.env.JWT_SECRET);
    return token;
  } catch (error) {
    throw error;
  }
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const isValidEmail = await validator.validate(email);
    if (!isValidEmail) {
      return res
        .status(400)
        .json({ success: false, msg: "enter a valid email" });
    }
    const avatar = req.file.filename;
    const user = await User.find({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: "email already registered" });
    }

    const hashedPassword = await spassword(password);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      avatar,
    });

    const token = await gentoken(newUser._id);
    res.status(201).json({
      success: true,
      msg: "user created successfully",
      data: newUser,
      token,
    });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isValidEmail = await validator.validate(email);
    if (!isValidEmail) {
      return res
        .status(400)
        .json({ success: false, msg: "enter a valid email" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, msg: "email or password incorrect" });
    }
    const isCorrectPassword = await bcryptjs.compare(password, user.password);
    if (!isCorrectPassword) {
      return res
        .status(401)
        .json({ success: false, msg: "email or password incorrect" });
    }
    const token = await gentoken(user._id);
    res
      .status(200)
      .json({ success: true, msg: "user logged in successfully", token });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
};

const user_profile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, msg: "user not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
};

const update_profile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, msg: "user not found" });
    }
    if (req.file !== undefined) {
      const avatar = req.file.filename;
      await User.findByIdAndUpdate(
        userId,
        {
          username,
          email,
          avatar,
        },
        { new: true }
      );
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username,
        email,
      },
      {
        new: true,
      }
    );
    res.status(201).json({
      success: true,
      msg: "user updated successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
};

const delete_profile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, msg: "user not found" });
    }
    await User.findByIdAndDelete(userId);
    res.status(200).json({ success: true, msg: "user deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
};

const logout_user = async (req, res) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers["authorization"];
    await BlacklistToken.create({
      accessToken: token,
    });
    res.status(200).json({ success: true, msg: "user logout successfully" });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  user_profile,
  update_profile,
  delete_profile,
  logout_user,
};
