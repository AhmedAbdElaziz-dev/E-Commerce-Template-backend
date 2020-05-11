const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saltRound = 7;
const util = require("util");
require('dotenv').config();

const sign = util.promisify(jwt.sign);
const verfiy = util.promisify(jwt.verify);
const secretkey = process.env.secretkey;

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
userSchema.pre("save", async function () {
  const userInstance = this;
  if (this.isModified("password")) {
    userInstance.password = await bcrypt.hash(userInstance.password, saltRound);
  }
});

userSchema.methods.comparePassword = async function (plainPassword) {
  const userInstance = this;
  return bcrypt.compare(plainPassword,userInstance.password);
};

userSchema.methods.generateToken = function (expiresIn = "30m") {
  const userInstance = this;
  return sign({ userId: userInstance.id }, secretkey);
};

userSchema.statics.getUserFromToken = async function (token) {
  const User = this;
  const payLoad = await verfiy(token, secretkey);
  const currentUser = await User.findById(payLoad.userId);
  if (!currentUser) throw new Error("user not found");
  return currentUser;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
