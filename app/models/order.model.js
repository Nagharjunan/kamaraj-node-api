const mongoose = require("mongoose");

const OrderID = mongoose.model(
  "orderid",
  new mongoose.Schema({
    orderId: Number,
  })
);

const Order = mongoose.model(
  "Order",
  new mongoose.Schema({
    orderDate: {
      type: String,
      required: true,
    },
    orderId: {
      type: Number,
      required: true,
    },
    orderedBy: {
      type: String,
      required: true,
    },
    paymentMode: {
      type: String,
      required: true,
    },
    orderStatus: {
      type: String,
      required: true,
    },
    approved: {
      type: {
        isApproved: Boolean,
        approvedBy: String,
        approvalDate: String,
      },
      required: true,
    },
    paymentDetails: {
      type: {
        isPaymentDone: Boolean,
        paymentMethod: String,
        paymentDate: String,
      },
      required: true,
    },
    modifiedBy: {
      modifiedDate: String,
      modifiedUser: String,
    },
    orderedFor: {
      type: {
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
      },
      required: true,
    },
    orderList: [
      {
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
        qty: String,
      },
    ],
  })
);

module.exports = { Order, OrderID };
