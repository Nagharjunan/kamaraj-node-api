exports.setPdfContent = async (
  doc,
  order,
  companyName,
  addressLine1,
  addressLine2,
  addressLine3,
  gstNo,
  fssaiNo
) => {
  doc.setFontSize(20);
  doc.setFont("times", "bold");
  doc.text(companyName, 10, 15);
  // can change font size to 12
  doc.setFontSize(10);
  doc.setFont("times", "normal");
  doc.text(addressLine1, 10, 22);
  doc.text(addressLine2, 10, 27);
  doc.text(addressLine3, 10, 32);
  doc.text(gstNo, 10, 37);
  doc.text(fssaiNo, 10, 42);
  doc.text("SALES INVOICE", 94, 42);

  doc.setFont("times", "bold");
  doc.text("TAX INVOICE NO: ", 150, 20);
  doc.setFont("times", "normal");
  doc.text(`${order.orderId}`, 183, 20);
  doc.setFont("times", "bold");
  doc.text(`INVOICE DATE: `, 150, 25);
  doc.setFont("times", "normal");
  doc.text(`${new Date(order.orderDate).toLocaleDateString("en-GB")}`, 183, 25);
  doc.setFont("times", "bold");
  doc.text(`Sales Mode: `, 150, 30);
  doc.setFont("times", "normal");
  doc.text(`${order.paymentMode.toUpperCase()}`, 173, 30);

  doc = setBillAddressBlock(doc, order);
  doc = setShipAddressBlock(doc, order);
  doc = setOrderList(doc, order);

  return doc;
};

function setBillAddressBlock(doc, order) {
  doc.setFont("times", "bold");
  doc.text("Details of Receiver (Billed to):", 10, 50);
  doc.setFont("times", "normal");
  doc.text("Name: ", 10, 55);
  doc.setFont("times", "bold");
  if (order.orderedFor.customerName.length > 30) {
    const customerSplit = order.orderedFor.customerName.split(",");
    doc.text(`${customerSplit[0]}`, 27, 55);
    doc.text(`${customerSplit[1]}`, 27, 60);
  } else {
    doc.text(`${order.orderedFor.customerName}`, 27, 55);
  }
  doc.setFont("times", "normal");
  doc.text("Address: ", 10, 65);
  doc.text(`${order.orderedFor.customerBillAddline1}`, 27, 65);
  doc.text(`${order.orderedFor.customerBillAddline2}`, 27, 70);
  doc.text(`${order.orderedFor.customerBillAddline3}`, 27, 75);
  doc.text("Phone: ", 10, 80);
  doc.text(`${order.orderedFor.phoneNumber}`, 27, 80);
  doc.text("Alt Phone: ", 57, 80);
  // doc.text(`${order.orderedFor.altPhoneNumber}`, 80, 80);
  doc.text("", 77, 80);
  doc.text("GSTIN: ", 10, 85);
  doc.text(`${order.orderedFor.gstNumber || "NIL"}`, 27, 85);
  doc.text("State: ", 10, 90);
  doc.text(`${order.orderedFor.state}`, 27, 90);
  doc.text("State Code: ", 57, 90);
  doc.text(`${order.orderedFor.stateCode}`, 77, 90);
  return doc;
}

function setShipAddressBlock(doc, order) {
  doc.setFont("times", "bold");
  doc.text("Details of Consignee (Shipped to):", 110, 50);
  doc.setFont("times", "normal");
  doc.text("Name: ", 110, 55);
  doc.setFont("times", "bold");
  if (order.orderedFor.customerName.length > 30) {
    const customerSplit = order.orderedFor.customerName.split(",");
    doc.text(`${customerSplit[0]}`, 127, 55);
    doc.text(`${customerSplit[1]}`, 127, 60);
  } else {
    doc.text(`${order.orderedFor.customerName}`, 127, 55);
  }
  doc.setFont("times", "normal");
  doc.text("Address: ", 110, 65);
  doc.text(`${order.orderedFor.customerBillAddline1}`, 127, 65);
  doc.text(`${order.orderedFor.customerBillAddline2}`, 127, 70);
  doc.text(`${order.orderedFor.customerBillAddline3}`, 127, 75);
  doc.text("Phone: ", 110, 80);
  doc.text(`${order.orderedFor.phoneNumber}`, 127, 80);
  doc.text("Alt Phone: ", 157, 80);
  // doc.text(`${order.orderedFor.altPhoneNumber}`, 80, 80);
  doc.text("", 177, 80);
  doc.text("GSTIN: ", 110, 85);
  doc.text(`${order.orderedFor.gstNumber || "NIL"}`, 127, 85);
  doc.text("State: ", 110, 90);
  doc.text(`${order.orderedFor.state}`, 127, 90);
  doc.text("State Code: ", 157, 90);
  doc.text(`${order.orderedFor.stateCode}`, 177, 90);
  return doc;
}

function setOrderList(doc, order) {
  doc.rect(5, 110, doc.internal.pageSize.width - 10, 130);
  doc.line(13, 95, 13, 240);
  doc.line(75, 95, 75, 240);
  doc.line(93, 95, 93, 240);
  doc.line(105, 95, 105, 240);
  doc.line(118, 95, 118, 240);
  doc.line(136, 95, 136, 240);
  doc.line(154, 95, 154, 240);
  doc.line(166, 95, 166, 240);
  doc.line(180, 95, 180, 240);
  doc.line(192, 95, 192, 240);

  doc.text("No.", 7, 100);
  doc.text("Product Name", 15, 100);
  doc.text("HSN", 77, 100);
  doc.text("Code", 77, 105);
  doc.text("QTY", 95, 100);
  doc.text("Unit", 108, 100);
  doc.text("Sales Rate", 120, 100);
  doc.text("Amount", 140, 100);
  doc.text("CGST", 155.5, 100);
  doc.text("%", 158, 105);
  doc.text("CGST", 169, 100);
  doc.text("AMT", 169.5, 105);
  doc.text("SGST", 182, 100);
  doc.text("%", 185, 105);
  doc.text("SGST", 194, 100);
  doc.text("AMT", 194.5, 105);

  let totalAmount = 0;
  let totalCGST = 0;
  order.orderList.forEach((item, index) => {
    totalAmount += item.salesRate * item.qty;
    const temp = (item.salesRate * item.qty * (item.CGST / 100)).toFixed(2);
    totalCGST += parseFloat(temp);

    doc.text(`${index + 1}`, 8, 115 + index * 5);
    doc.text(`${item.productName}`, 15, 115 + index * 5);
    doc.text("17021110", 76, 115 + index * 5);
    doc.text(`${item.qty}`, 96, 115 + index * 5);
    doc.text(`${item.unit}`, 111.5, 115 + index * 5, { align: "center" });
    doc.text(`${parseFloat(item.salesRate).toFixed(2)}`, 133, 115 + index * 5, {
      align: "right",
    });
    // change to qty
    doc.text(
      `${(item.salesRate * item.qty).toFixed(2)}`,
      152,
      115 + index * 5,
      {
        align: "right",
      }
    );
    doc.text(`${item.CGST}`, 158, 115 + index * 5);
    doc.text(
      `${(item.salesRate * item.qty * (item.CGST / 100)).toFixed(2)}`,
      178,
      115 + index * 5,
      { align: "right" }
    );
    doc.text(`${item.SGST}`, 188.5, 115 + index * 5, { align: "right" });
    doc.text(
      `${(item.salesRate * item.qty * (item.SGST / 100)).toFixed(2)}`,
      203,
      115 + index * 5,
      { align: "right" }
    );
  });

  let netTotal = totalAmount + totalCGST * 2;

  const header = ["TAX %", "Taxable Amt", "CGST Amt", "SGST Amt", "Total Amt"];

  const data = [
    {
      "TAX %": "2.5%",
      "Taxable Amt": `${totalAmount.toFixed(2)}`,
      "CGST Amt": `${totalCGST.toFixed(2)}`,
      "SGST Amt": `${totalCGST.toFixed(2)}`,
      "Total Amt": `${(totalAmount + totalCGST * 2).toFixed(2)}`,
    },
    {
      "TAX %": "TOT",
      "Taxable Amt": `${totalAmount.toFixed(2)}`,
      "CGST Amt": `${totalCGST.toFixed(2)}`,
      "SGST Amt": `${totalCGST.toFixed(2)}`,
      "Total Amt": `${(totalAmount + totalCGST * 2).toFixed(2)}`,
    },
  ];

  doc.table(5, 240, data, header, {
    fontSize: 8,
    autoSize: false,
    margins: 0,
  });
  const roundOff = Math.round(netTotal) - netTotal;

  doc.setFontSize(10);
  doc.text("Total amount before tax", 140, 245);
  doc.text(`${totalAmount.toFixed(2)}`, 203, 245, { align: "right" });
  doc.text("Total CGST", 140, 250);
  doc.text(`${totalCGST.toFixed(2)}`, 203, 250, { align: "right" });
  doc.text("Total SGST", 140, 255);
  doc.text(`${totalCGST.toFixed(2)}`, 203, 255, { align: "right" });
  doc.text("Total IGST", 140, 260);
  doc.text(`${(0).toFixed(2)}`, 203, 260, { align: "right" });
  doc.text("Rounding off", 140, 265);
  doc.text(`${roundOff.toFixed(2)}`, 203, 265, { align: "right" });
  doc.text("Total amount after tax", 140, 270);
  doc.text(`${Math.round(netTotal).toFixed(2)}`, 203, 270, {
    align: "right",
  });

  doc.text("For Nagharjuna Foods Pvt Ltd", 150, 290);
  doc.setFontSize(14);
  console.log(Math.round(netTotal));
  console.log(generateWords(123123));
  console.log(generateWords(1231231));
  doc.text(capitalizeParagraph(generateWords(Math.round(netTotal))), 10, 275);
  return doc;
}

function capitalizeParagraph(paragraph) {
  // Split the paragraph into sentences
  let sentences = paragraph.split(" ");

  // Capitalize the first letter of each sentence
  sentences = sentences.map(
    (sentence) => sentence.charAt(0).toUpperCase() + sentence.slice(1)
  );

  // Join the sentences back together
  paragraph = sentences.join(" ");

  return paragraph;
}

var TEN = 10;
var ONE_HUNDRED = 100;
var ONE_THOUSAND = 1000;
var ONE_LAKH = 100000;
// Need to change
var ONE_CRORE = 10000000;

var LESS_THAN_TWENTY = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];

var TENTHS_LESS_THAN_HUNDRED = [
  "zero",
  "ten",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];

/**
 * Converts an integer into words.
 * If number is decimal, the decimals will be removed.
 * @example toWords(12) => 'twelve'
 * @param {number|string} number
 * @param {boolean} [asOrdinal] - Deprecated, use toWordsOrdinal() instead!
 * @returns {string}
 */

function generateWords(number) {
  var remainder,
    word,
    words = arguments[1];

  // We’re done
  if (number === 0) {
    return !words ? "zero" : words.join(" ").replace(/,$/, "");
  }
  // First run
  if (!words) {
    words = [];
  }
  // If negative, prepend “minus”
  if (number < 0) {
    words.push("minus");
    number = Math.abs(number);
  }

  if (number < 20) {
    remainder = 0;
    word = LESS_THAN_TWENTY[number];
  } else if (number < ONE_HUNDRED) {
    remainder = number % TEN;
    word = TENTHS_LESS_THAN_HUNDRED[Math.floor(number / TEN)];
    // In case of remainder, we need to handle it here to be able to add the “-”
    if (remainder) {
      word += "-" + LESS_THAN_TWENTY[remainder];
      remainder = 0;
    }
  } else if (number < ONE_THOUSAND) {
    remainder = number % ONE_HUNDRED;
    word = generateWords(Math.floor(number / ONE_HUNDRED)) + " hundred";
  } else if (number < ONE_LAKH) {
    remainder = number % ONE_THOUSAND;
    word = generateWords(Math.floor(number / ONE_THOUSAND)) + " thousand,";
  } else if (number < ONE_CRORE) {
    remainder = number % ONE_LAKH;
    word = generateWords(Math.floor(number / ONE_LAKH)) + " lakh,";
  }

  words.push(word);
  return generateWords(remainder, words);
}
