const express = require("express");
const controller_cart = require("../controller/controller.cart");

const router = express.Router();

router.get("/", controller_cart.get_cart);
router.patch("/item", controller_cart.patch_cart_item )
router.post("/item", controller_cart.post_cart_item);

module.exports = router;