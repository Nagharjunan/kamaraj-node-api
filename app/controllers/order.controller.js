const db = require("../models");
const PDFDocument = require("jspdf");
const nodemailer = require("nodemailer");
const Order = db.order;

exports.createOrder = async (req, res) => {
  console.log(req.body);
  const order = new Order({
    orderDate: req.body.orderDate,
    orderedBy: req.body.orderedBy,
    paymentMode: req.body.paymentMode,
    orderStatus: req.body.orderStatus,
    approved: req.body.approved,
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

exports.getAllOrders = async (req, res) => {
  try {
    const response = await Order.find({});
    return res.status(200).send(response);
  } catch (err) {
    return res.status(500).send({ message: "Error while fetching orders" });
  }
};

exports.fetchOrderAndSendPDF = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    const doc = new jsPDF();
    doc.text(`Order ID: ${order._id}`);
    doc.text(`Order Date: ${order.orderDate}`);
    doc.text(`Ordered By: ${order.orderedBy}`);
    // Add more order details as needed

    doc.save("order.pdf");

    // const pdfBuffer = doc.output("arraybuffer");

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
