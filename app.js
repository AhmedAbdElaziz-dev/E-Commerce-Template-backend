const express = require("express");

require("./db");
const app = express();
const port = 2000;
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const categoryRoute = require("./routes/category");
const cors = require("cors");
const multer = require("multer");
// const upload = multer({dest:"images"})
const storage = require("./helper/storage")
const path=require("path");
require('express-async-errors');

app.use(cors());
app.use(express.json());
app.use(multer({storage:storage}).single('image'))
app.use(express.urlencoded({ extended: false }));
app.use("/images",express.static(path.join(__dirname,'images')))
// app.use("/images",express.static('images'))
app.use("/user", userRoute);
app.use("/category", categoryRoute);
app.use("/product", productRoute);

app.use((req, res, next) => {
  console.log({
    "request url": req.url,
    body: req.header,
    method: req.method,
    "requst time": new Date(),
  });
});

app.use((err, req, res, next) => {
  const statusCode = req.statusCode || 500;
  if (statusCode >= 500) {
    res.status(statusCode).json({
      message: "SomeThing Went Wrong!",
      type: "INTERNAL_SERVER_ERROR !",
      detail: [],
    });
  } else {
    res.status(statusCode).json({
      message: err.message,
      type: err.type,
      detail: [err.detail],
    });
  }
});
app.listen(port, () => {
  console.log("server is running");
});
