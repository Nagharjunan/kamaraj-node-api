const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  const isDuplicateUser = await User.findOne({
    username: req.body.username,
  });
  console.log(isDuplicateUser);
  if (isDuplicateUser) {
    res
      .status(409)
      .send({ message: "User Already Exists, try contacting Admin" });
  } else {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      role: req.body.role,
    });

    try {
      const response = await user.save();
      console.log(response);
      res.status(200).send({ message: "User was registered successfully!" });
      return;
    } catch (err) {
      res.status(500).send({ message: err });
      return;
    }
  }
};

exports.signin = async (req, res) => {
  try {
    const isUserPresent = await User.findOne({ email: req.body.email });
    console.log(isUserPresent);

    if (!isUserPresent) {
      console.log("inside if");
      return res.status(404).send({ message: "User Not found, Contact Admin" });
    } else {
      console.log("inside else");
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        isUserPresent.password
      );
      console.log("inside else after pass");
      if (!passwordIsValid) {
        return res
          .status(401)
          .send({ accessToken: null, message: "Invalid Password" });
      }
      console.log("jwt sign");
      const token = jwt.sign({ id: isUserPresent.id }, config.secret, {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: 86400,
      });
      console.log("final sent");
      res.status(200).send({
        message: "Login Success",
        value: {
          id: isUserPresent._id,
          username: isUserPresent.username,
          email: isUserPresent.email,
          role: isUserPresent.role,
          accessToken: token,
        },
      });
    }
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};
