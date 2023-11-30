const db = require("../models");
const Product = db.product;

// exports.setProducts = async (req, res, next) => {
//   const response = await Product.insertMany(req.body.productArr);
//   console.log(response);
//   res.status(200).send({ message: "completed", response });
// };

exports.getProducts = async (req, res, next) => {
  const response = await Product.find({});
  res.status(200).send({ message: "fetch success", value: response });
};
