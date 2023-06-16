const multer = require("multer");
const uuid = require("uuid");

const upload_config = {
    storage: multer.diskStorage({
        destination: "data/images/products",
        filename: function(req, file, callback){
            callback(null, uuid.v4() + "-"  + file.originalname )
        }
    })
};

module.exports = {
    upload_config: upload_config,
}