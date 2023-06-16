const express = require("express");
const controller_products = require("../controller/controller.products");

const router = express.Router();

router.get("/products", controller_products.get_products);

module.exports = router;