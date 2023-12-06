const db = require("../models");
const Order = db.order;

exports.createOrder = async (req, res) => {
  console.log(req.body);
  const order = new Order({
    orderDate: req.body.orderDate,
    orderedBy: req.body.userId,
    modifiedBy: req.body.modifiedBy,
    orderedFor: req.body.customer,
    orderList: req.body.orderList,
  });

  try {
    const response = await order.save();
    return res.status(200).send({ message: "Order Successfully Created" });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Order Creation Failed", error: err });
  }
};
