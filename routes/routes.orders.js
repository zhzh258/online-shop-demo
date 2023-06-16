const express = require("express");
const controller_orders = require("../controller/controller.orders");

const router = express.Router();

router.get("/orders", controller_orders.get_orders);
router.post("/orders", controller_orders.post_orders);

router.get("/success", controller_orders.get_success)
router.get("/cancel", controller_orders.get_cancel)

module.exports = router;