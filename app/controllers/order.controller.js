const { setPdfContent } = require("../config/pdf.config");
const db = require("../models");
const jsPDF = require("jspdf").jsPDF;
const nodemailer = require("nodemailer");
const Order = db.order;
const OrderID = db.orderID;
const DeletedOrder = db.deletedOrder;

exports.createOrder = async (req, res) => {
  const orderID = await OrderID.find({});

  const order = new Order({
    orderDate: req.body.orderDate,
    orderedBy: req.body.orderedBy,
    paymentMode: req.body.paymentMode,
    orderStatus: req.body.orderStatus,
    approved: req.body.approved,
    modifiedBy: req.body.modifiedBy,
    orderedFor: req.body.orderedFor,
    orderList: req.body.orderList,
    orderId: orderID[0].orderId,
    paymentDetails: req.body.paymentDetails,
  });

  try {
    const response = await order.save();
    const newOrderID = orderID[0].orderId + 1;
    await OrderID.updateOne(
      { _id: orderID[0]._id },
      { $set: { orderId: newOrderID } }
    );
    return res.status(200).send({ message: "Order Successfully Created" });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Order Creation Failed", error: err });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const response = await Order.find({});
    return res.status(200).send({ message: "Fetch Success", value: response });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Error while fetching orders", error: err });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const response = await Order.find({
      orderedBy: req.params.orderedBy,
    });
    if (!response.length) {
      res.status(404).send({ message: "No Orders Found", error: {} });
    }
    res.status(200).send({ message: "Orders Found", value: response });
  } catch (err) {}
};

exports.getPendingOrders = async (req, res) => {
  try {
    const response = await Order.find({
      orderStatus: "pending",
    });
    if (!response.length) {
      res.status(404).send({ message: "No Orders Found", error: {} });
    }
    res.status(200).send({ message: "Orders Found", value: response });
  } catch (err) {}
};

exports.updateOrder = async (req, res) => {
  const isOrderAvailable = await Order.findOne({
    _id: req.body._id,
  });

  if (!isOrderAvailable) {
    return res.status(404).send({ message: "Order Not Found" });
  }
  try {
    const response = await Order.findByIdAndUpdate(req.body._id, req.body);
    return res.status(200).send({ message: "Order Updated Successfully" });
  } catch (err) {
    return res.status(500).send({ message: "Order Updation Failed" });
  }
};

exports.deleteOrder = async (req, res) => {
  const isOrderAvailable = await Order.findOne({
    _id: req.params.orderid,
  });
  if (!isOrderAvailable) {
    return res.status(404).send({ message: "Order Not Found" });
  }
  try {
    const deletedOrder = new DeletedOrder(isOrderAvailable);
    const deletedOrderRes = await deletedOrder.save();
    const response = await Order.findByIdAndDelete(req.params.orderid);
    console.log(response);
    return res.status(200).send({ message: "Order Deleted Successfully" });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Order Deletion Failed", error: err });
  }
};

exports.setOrderApproval = async (req, res) => {
  const response = await Order.findById(req.body.orderId);
  if (!response) {
    res.status(404).send({ message: "No Orders Found", error: {} });
  }
  try {
    await Order.updateOne(
      { _id: req.body.orderId },
      {
        $set: {
          orderStatus: "approved",
          approved: {
            isApproved: true,
            approvedBy: req.body.approvedBy,
            approvalDate: Date.now(),
          },
        },
      }
    );
    return res.status(200).send({ message: "Order Approved Successfully" });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Order Approval Failed", error: err });
  }
};

exports.fetchOrderAndSendPDF = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    let companyName = "Nagharjuna Foods";
    let addressLine1 = "9,ARASU NAGAR,MALAI KOVIL ST.,";
    let addressLine2 = "MUTHAMPALAYAM PHASE III";
    let addressLine3 = "KASIPALAYAM, ERODE. CEL 90430 25052.";
    let gstNo = "33AJXPR7429L1Z9";
    let fssaiNo = "12419007000519";

    let doc = new jsPDF();

    doc.rect(
      5,
      5,
      doc.internal.pageSize.width - 10,
      doc.internal.pageSize.height - 10
    );

    doc.rect(5, 45, doc.internal.pageSize.width - 10, 50);
    doc.rect(5, 45, doc.internal.pageSize.width - 110, 50);

    doc = await setPdfContent(
      doc,
      order,
      companyName,
      addressLine1,
      addressLine2,
      addressLine3,
      gstNo,
      fssaiNo
    );

    const pdfBuffer = doc.output("arraybuffer");
    res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=sample.pdf",
      "Content-Length": pdfBuffer.byteLength,
    });
    res.end(Buffer.from(pdfBuffer));

    // const transporter = nodemailer.createTransport({
    //   // Configure your email transporter here
    // });

    // const mailOptions = {
    //   from: "sender@example.com",
    //   to: "recipient@example.com",
    //   subject: "Order PDF",
    //   text: "Please find the order PDF attached.",
    //   attachments: [
    //     {
    //       filename: "order.pdf",
    //       content: pdfBuffer,
    //     },
    //   ],
    // };

    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     console.log("Error sending email:", error);
    //     return res.status(500).send({ message: "Error sending email" });
    //   }
    //   console.log("Email sent:", info.response);
    //   return res.status(200).send({ message: "Email sent successfully" });
    // });
  } catch (err) {
    console.log("Error fetching order:", err);
    return res.status(500).send({ message: "Error fetching order" });
  }
};
