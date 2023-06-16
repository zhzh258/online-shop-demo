const multer = require("multer");
const config = require("../config/config.multer")

const upload = multer(config.upload_config);

const middleware_upload_image = upload.single("image");

module.exports = middleware_upload_image;