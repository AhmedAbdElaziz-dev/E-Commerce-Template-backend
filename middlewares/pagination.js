module.exports = async (req, res, next) => {
  let {
    currentPage = 1,
    pageSize,
    // ,currentPrpducts
  } = req.query;
  currentPage = parseInt(currentPage);
  pageSize = parseInt(pageSize);
  const startIndex = (currentPage - 1) * pageSize;

  const productLength = res.productLength;
  let products;
  productLength > pageSize
    ? (products = res.products.slice(startIndex, startIndex + pageSize))
    : (products = res.products);

  res.json({
    products: products,
    productLength: productLength,
  });

  // }
};
