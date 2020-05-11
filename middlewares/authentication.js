const User = require("../models/user");
const CustomError = require("../helper/customError");

module.exports = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) throw CustomError(402, "no Authorization provided !");
  const currentUser = await User.getUserFromToken(token);
  req.user = currentUser;
  next();
};
