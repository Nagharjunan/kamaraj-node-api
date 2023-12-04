const controller = require("../controllers/customer.controller");
const { authJwt } = require("../middlewares");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-type, Accept"
    );
    next();
  });

  //   app.post("/setcustomers", [authJwt.verifyToken], controller.setcustomers);
  app.get("/getcustomers", [authJwt.verifyToken], controller.getCustomers);
  app.post("/createcustomer", [authJwt.verifyToken], controller.createCustomer);
  app.update(
    "/updatecustomer",
    [authJwt.verifyToken],
    controller.updateCustomer
  );
  app.delete(
    "/deletecustomer",
    [authJwt.verifyToken],
    controller.deleteCustomer
  );
};
