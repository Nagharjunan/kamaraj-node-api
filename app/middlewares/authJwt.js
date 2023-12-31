const db = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send({ message: "No Token Provided" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorised!",
      });
    }
    req.userId = decoded.indexOf;
    next();
  });
};

const authJwt = {
  verifyToken,
};

module.exports = authJwt;
