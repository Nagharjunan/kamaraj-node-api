const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  console.log(req.body);

  // user.save((err, user) => {
  // if (err) {
  //   res.status(500).send({ message: err });
  // }

  User.findOne({ username: req.body.username }).then(() => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
  });

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    role: req.body.role,
  });

  user
    .save()
    .then(() => {
      res.send({ message: "User was registered successfully!" });
    })
    .catch((err) => {
      res.send({ message: "User registration failed!" });
    });

  // });
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
