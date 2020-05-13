const express = require("express");
const router = express.Router();
const _ = require("lodash");
const PaginationMiddleware = require("../middlewares/pagination");
const Product = require("../models/product");
const AuthenticationMiddleware = require("../middlewares/authentication");
const ownerAuthorizatin = require("../middlewares/ownerAuthorization");
const multer = require("multer");
require('express-async-errors');

router.post(
  "/add-product",
  AuthenticationMiddleware,
  async (req, res, next) => {
    const {
      name,
      discription,
      price,
      status,
      discount,
      paymentType,
      categoryId,
      imageUrl
    } = req.body;
    // const imageUrl = req.file;
    // console.log(imageUrl);
    const userId = req.user.id;
    const product = new Product({
      userId,
      name,
      discription,
      price,
      status,
      paymentType,
      categoryId,
      discount,
    });
    await product.save();
    res.status(200).json({
      product: product,
    });
    next();
  }
);
router.post("/uploadImage",(req,res,next)=>{
  const image = req.file;
  const imagepath = image.path
  const imageUrl =imagepath.replace('\\','/');
  res.json({
    imageUrl
  })
})
router.get(
  "/",
  async (req, res, next) => {
    const products = await Product.find();
    res.products = products;
    res.productLength = products.length;
    next();
  },
  PaginationMiddleware
);

router.patch(
  "/edit-product/:id",
  AuthenticationMiddleware,
  ownerAuthorizatin,
  async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;
    const {
      name,
      discription,
      price,
      status,
      discount,
      paymentType,
      categoryId,
    } = req.body;

    const product = await Product.findByIdAndUpdate(
      { _id: id },
      {
        userId,
        name,
        discription,
        price,
        status,
        paymentType,
        categoryId,
        discount,
      },
      { new: true, runValidators: true, omitUndefined: true }
    );
    res.status(200).json({
      product: product,
    });
  }
);

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate("categoryId");
  res.status(200).json({
    product: product,
  });
});

router.delete(
  "/delete",
  AuthenticationMiddleware,
  ownerAuthorizatin,
  async (req, res, next) => {
    const { id } = req.query;
    await Product.findOneAndRemove({ _id: id });
    const products = await Product.find();
    res.json({
      products: products,
    });
  }
);

router.post(
  "/productsHandler",
  async (req, res, next) => {
    const {
      selectedCategoryId: categoryId,
      sortType,
      searchValue,
      currentProducts,
    } = req.body;

    let category = categoryId ? { categoryId } : {};
    let search = searchValue
      ? {
          name: { $regex: new RegExp(".*" + searchValue.toLowerCase() + ".*") },
        }
      : {};
    let newProducts = currentProducts
      ? currentProducts
      : await Product.find({ ...category, ...search });

    let sorting = [
      {
        case: "2",
        type: "price",
        order: "asc",
      },
      {
        case: "3",
        type: "price",
        order: "desc",
      },
      {
        case: "4",
        type: "name",
        order: "asc",
      },
    ];

    if (sortType) {
      sorting.forEach((el) => {
        if (sortType === el.case)
          newProducts = _.orderBy(newProducts, el.type, el.order);
      });
    }
    res.products = newProducts;
    res.productLength = newProducts.length;
    next();
  },
  PaginationMiddleware
);

// router.post("/paging",PaginationMiddleware)

module.exports = router;
