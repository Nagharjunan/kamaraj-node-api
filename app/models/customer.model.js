const mongoose = require("mongoose");

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    customerName: String,
    customerBillAddline1: String,
    customerBillAddline2: String,
    customerBillAddline3: String,
    customerShipAddline1: String,
    customerShipAddline2: String,
    customerShipAddline3: String,
    phoneNumber: String,
    altPhoneNumber: String,
    gstNumber: String,
    state: String,
    stateCode: String,
  })
);

module.exports = Customer;
