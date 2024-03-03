const mongoose = require("mongoose");
const { Order, OrderID, DeletedOrder } = require("./order.model");

mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.product = require("./product.model");
db.customer = require("./customer.model");
db.order = Order;
db.orderID = OrderID;
db.deletedOrder = DeletedOrder;

module.exports = db;
