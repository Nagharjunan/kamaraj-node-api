const db = require("../models");
const Product = db.product;

// exports.setProducts = async (req, res, next) => {
//   const response = await Product.insertMany(req.body.productArr);
//   console.log(response);
//   res.status(200).send({ message: "completed", response });
// };

exports.getProducts = async (req, res, next) => {
  try {
    const response = await Product.find({});
    res.status(200).send({ message: "Fetch Success", value: response });
  } catch (err) {
    res.status(500).send({ message: "Fetch Failed", error: err });
  }
};

exports.createProduct = async (req, res, next) => {
  const isDuplicateProduct = await Product.findOne({
    productCode: req.body.productCode,
  });
  if (isDuplicateProduct) {
    return res.status(409).send({ message: "Product Already Exists" });
  }

  const product = new Product({
    productCode: req.body.productCode,
    productName: req.body.productName,
    HSN_Code: req.body.HSN_Code,
    unit: req.body.unit,
    purchaseRate: req.body.purchaseRate,
    GST: req.body.GST,
    salesRate: req.body.salesRate,
    CGST: req.body.CGST,
    SGST: req.body.SGST,
    IGST: req.body.IGST,
    reOrderLevel: req.body.reOrderLevel,
  });
  try {
    const response = await product.save();
    return res.status(200).send({ message: "Product Successfully Created" });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Product Creation Failed", error: err });
  }
};

exports.updateProduct = async (req, res) => {
  const isProductAvailable = await Product.findOne({
    _id: req.body._id,
  });
  if (!isProductAvailable) {
    return res.status(404).send({ message: "Product Not Found" });
  }
  try {
    const response = await Product.findByIdAndUpdate(req.body._id, req.body);
    return res.status(200).send({ message: "Product Updated Successfully" });
  } catch (err) {
    return res.status(500).send({ message: "Product Updation Failed" });
  }
};

exports.deleteProduct = async (req, res) => {
  const isProductAvailable = await Product.findOne({
    _id: req.params.id,
  });

  if (!isProductAvailable) {
    return res.status(404).send({ message: "Product Not Found" });
  }
  try {
    const response = await Product.findByIdAndDelete(req.params.id);
    return res.status(200).send({ message: "Product Deleted Successfully" });
  } catch (err) {
    return res.status(500).send({ message: "Product Deletion Failed" });
  }
};
