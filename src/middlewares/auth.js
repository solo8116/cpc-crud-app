const jwt = require("jsonwebtoken");
const BlacklistToken = require("../models/logout");
require("dotenv").config();

const auth = async (req, res, next) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers["authorization"];
    if (!token) {
      return res.status(400).json({ success: false, msg: "enter the token" });
    }
    const isTokenBlacklist = await BlacklistToken.find({ accessToken: token });
    if (isTokenBlacklist.length !== 0) {
      return res
        .status(400)
        .json({ success: false, msg: "this session has expired" });
    }
    const isValidToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!isValidToken) {
      return res
        .status(400)
        .json({ success: false, msg: "token is not valid" });
    }
    const decode = jwt.decode(token);
    req.user = decode;
    next();
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = auth;
