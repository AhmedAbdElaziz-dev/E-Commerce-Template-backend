const Product = require("../models/product");
const CustomError = require("../helper/customError");

module.exports = async (req, res, next) => {
  const {
    params: { id: postId },
    user: { id: userId },
  } = req;

  const post = await Product.findById(postId);
  if (!post.userId.equals(userId)) {
    throw CustomError(402, "Not Auhtorized");
  }
  next();
};
