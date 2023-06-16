const express = require("express");
const controller_auth = require("../controller/controller.auth");

const router = express.Router();

router.get("/signup", controller_auth.get_signup);
router.post("/signup", controller_auth.post_signup);
router.get("/login", controller_auth.get_login);
router.post("/login", controller_auth.post_login);
router.post("/logout", controller_auth.post_logout);


module.exports = router;