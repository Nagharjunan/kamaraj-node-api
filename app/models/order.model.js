const mongoose = require("mongoose");

const Order = mongoose.model(
  "Order",
  new mongoose.Schema({
    orderDate: {
      type: String,
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
    modifiedBy: {
      modifiedDate: String,
      modifiedUser: String,
    },
    orderedFor: {
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
      },
    ],
  })
);

module.exports = Order;
