const mongoose = require("mongoose");

const Product = mongoose.model(
    "Product",
    new mongoose.Schema({
      productName: String,
      productCode: String,
      productRate: String,
      purchaseRate: String,
    })
  );
  
  module.exports = Product;
  