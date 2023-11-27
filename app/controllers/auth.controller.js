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

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (!user) {
      return res.status(404).send({ message: "User Not found, Contact Admin" });
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res
        .status(401)
        .send({ accessToken: null, message: "Invalid Password" });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      algorithm: "HS256",
      allowInsecureKeySizes: true,
      expiresIn: 86400,
    });

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      accessToken: token,
    });
  });
};
