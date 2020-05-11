const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  userId: {
    type: mongoose.ObjectId,
  },
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 15,
  },
  discription: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 500,
  },
  price: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    required: true,
  },
  paymentType: {
    type: String,
    required: true,
  },
  categoryId: {
    type: mongoose.ObjectId,
    ref: "Category",
  },
  discount: {
    type: Number,
    required: true,
  },
  imageUrl:{
    type:String
  }
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
