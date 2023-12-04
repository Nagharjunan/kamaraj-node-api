const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.product = require("./product.model");
db.customer = require("./customer.model");

module.exports = db;
