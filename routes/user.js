const express = require("express");
const router = express.Router();
const User = require("../models/user");
// const AuthenticationMiddleware = require("../middlewares/authentication");
const ValidationMiddleware = require("../middlewares/validation");
const { check } = require("express-validator");
const CustomError = require("../helper/customError");
require('express-async-errors');
router.post(
  "/register",
  ValidationMiddleware(
    check("password")
      .isLength({
        min: 5,
      })
      .withMessage("must be at least 5 chars long")
      .matches(/\d/)
      .withMessage("must contain a number")
  ),

  async (req, res, next) => {
    const { userName, password } = req.body;
    const unique = await User.findOne({ userName });
    if (unique) throw CustomError(422, "userName is already exist!");
    const user = new User({ userName, password });
    await user.save();
    res.status(200).json({
      user: user,
    });
  }
);
router.post("/login", async (req, res, next) => {
  const { userName, password } = req.body;
  const user = await User.findOne({ userName });
  if (!user) throw CustomError(423, "userName or passowrd not valid");
  const match = await user.comparePassword(password);
  if (!match) throw CustomError(423, "userName or passowrd not valid");
  const token = await user.generateToken();

  res.json({
    user,
    token,
  });
});

module.exports = router;
