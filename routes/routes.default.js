const express = require("express");
const controller_default = require("../controller/controller.default");

const router = express.Router();

router.get("/", controller_default.get_);


module.exports = router;