const express = require("express");
const router = express.Router();
const Category = require("../models/category");
require('express-async-errors');
router.get("/", async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json({
    categories: categories,
  });
});
router.post("/add", async (req, res, next) => {
  const { name, id } = req.body;
  const category = new Category({ name, id });
  await category.save();
  res.status(200).json({
    category: category,
  });
});
module.exports = router;
