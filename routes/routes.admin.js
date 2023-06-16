const express = require("express");
const controller_admin = require("../controller/controller.admin");
const middleware_upload_image = require("../middlewares/image_upload");

const router = express.Router();

router.get("/products", controller_admin.get_products);
router.post("/products",middleware_upload_image, controller_admin.post_products);

router.get("/products/new", controller_admin.get_products_new);

router.get("/products/:id", controller_admin.get_products_update);
router.post("/products/:id",middleware_upload_image, controller_admin.post_products_update);

router.delete("/products/:id", controller_admin.delete_products)

router.get("/orders", controller_admin.get_orders);
router.post("/orders", controller_admin.post_orders);


module.exports = router;