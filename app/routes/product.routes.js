const controller = require("../controllers/product.controller");
const { authJwt } = require("../middlewares");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-type, Accept"
    );
    next();
  });

  //   app.post("/setproducts", [authJwt.verifyToken], controller.setProducts);
  app.get("/getproducts", [authJwt.verifyToken], controller.getProducts);
  app.post("/createproduct", [authJwt.verifyToken], controller.createProduct);
  app.patch("/updateproduct", [authJwt.verifyToken], controller.updateProduct);
  app.delete("/deleteproduct", [authJwt.verifyToken], controller.deleteProduct);
};
