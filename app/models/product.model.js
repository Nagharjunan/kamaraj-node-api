const mongoose = require("mongoose");

const Product = mongoose.model(
  "Product",
  new mongoose.Schema({
    productCode: String,
    productName: String,
    HSN_Code: String,
    unit: String,
    purchaseRate: String,
    GST: String,
    salesRate: String,
    CGST: String,
    SGST: String,
    IGST: String,
    reOrderLevel: String,
  })
);

module.exports = Product;
