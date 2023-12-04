const db = require("../models");
const Customer = db.customer;

// exports.setCustomers = async (req, res, next) => {
//   const response = await Customer.insertMany(req.body.CustomerArr);
//   console.log(response);
//   res.status(200).send({ message: "completed", response });
// };

exports.getCustomers = async (req, res, next) => {
  try {
    const response = await Customer.find({});
    res.status(200).send({ message: "Fetch Success", value: response });
  } catch (err) {
    res.status(500).send({ message: "Fetch Failed", error: err });
  }
};

exports.createCustomer = async (req, res, next) => {
  const isDuplicateCustomer = await Customer.findOne({
    phoneNumber: req.body.phoneNumber,
  });
  if (isDuplicateCustomer) {
    return res.status(409).send({ message: "Customer Already Exists" });
  }

  const customer = new Customer({
    customerName: req.body.customerName,
    customerBillAddline1: req.body.customerBillAddline1,
    customerBillAddline2: req.body.customerBillAddline2,
    customerBillAddline3: req.body.customerBillAddline3,
    customerShipAddline1: req.body.customerShipAddline1,
    customerShipAddline2: req.body.customerShipAddline2,
    customerShipAddline3: req.body.customerShipAddline3,
    phoneNumber: req.body.phoneNumber,
    altPhoneNumber: req.body.altPhoneNumber,
    gstNumber: req.body.gstNumber,
    state: req.body.state,
    stateCode: req.body.stateCode,
  });
  try {
    const response = await customer.save();
    return res.status(200).send({ message: "Customer Successfully Created" });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Customer Creation Failed", error: err });
  }
};

exports.updateCustomer = async (req, res) => {
  const isCustomerAvailable = await Customer.findOne({
    _id: req.body._id,
  });
  if (!isCustomerAvailable) {
    return res.status(404).send({ message: "Customer Not Found" });
  }
  try {
    const response = await Customer.findByIdAndUpdate(req.body._id);
    return res.status(200).send({ message: "Customer Updated Successfully" });
  } catch (err) {
    return res.status(500).send({ message: "Customer Updation Failed" });
  }
};

exports.deleteCustomer = async (req, res) => {
  const isCustomerAvailable = await Customer.findOne({
    _id: req.body._id,
  });

  if (!isCustomerAvailable) {
    return res.status(404).send({ message: "Customer Not Found" });
  }
  try {
    const response = await Customer.findByIdAndDelete(req.body._id);
    return res.status(200).send({ message: "Customer Deleted Successfully" });
  } catch (err) {
    return res.status(500).send({ message: "Customer Deletion Failed" });
  }
};
