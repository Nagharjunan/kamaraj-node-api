const { setPdfContent } = require("../config/pdf.config");
const db = require("../models");
const jsPDF = require("jspdf").jsPDF;
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
    orderedFor: req.body.orderedFor,
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
    return res.status(200).send({ message: "Fetch Success", value: response });
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
    const orderLength = await Order.find({}).countDocuments();

    let companyName = "Nagharjuna Foods";
    let addressLine1 = "9,ARASU NAGAR,MALAI KOVIL ST.,";
    let addressLine2 = "MUTHAMPALAYAM PHASE III";
    let addressLine3 = "KASIPALAYAM, ERODE. CEL 90430 25052.";
    let gstNo = "GSTIN 33AAGFN 0326E1ZP";
    let fssaiNo = "FSSAI 124 190 010 000 11";

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
      orderLength,
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
