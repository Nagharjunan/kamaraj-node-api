const express = require("express");
const cors = require("cors");
var bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");

db.mongoose
  .connect(
    "mongodb+srv://nagharjunan:ga9FK3Y3H1ldaK3j@kamaraj.93j44yk.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "Dev",
    }
  )
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => {
    console.log("Connection error", err);
    process.exit();
  });

app.use(bodyParser.urlencoded({ extended: false }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// custom routes
require("./app/routes/auth.routes")(app);
require("./app/routes/product.routes")(app);
require("./app/routes/customer.routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
