const controller = require("../controllers/order.controller");
const { authJwt } = require("../middlewares");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-type, Accept"
    );
    next();
  });
  app.post("/createorder", [authJwt.verifyToken], controller.createOrder);
  app.get("/getorders", [authJwt.verifyToken], controller.getAllOrders);
  app.get(
    "/getmyorders/:orderedBy",
    [authJwt.verifyToken],
    controller.getMyOrders
  );
  app.get(
    "/getpendingorders",
    [authJwt.verifyToken],
    controller.getPendingOrders
  );
  app.post("/updateorder", [authJwt.verifyToken], controller.updateOrder);
  app.get(
    "/deleteorder/:orderid",
    [authJwt.verifyToken],
    controller.deleteOrder
  );
  app.post(
    "/setorderapproval",
    [authJwt.verifyToken],
    controller.setOrderApproval
  );
  app.get(
    "/sendorderpdf/:orderId",
    [authJwt.verifyToken],
    controller.fetchOrderAndSendPDF
  );
};
