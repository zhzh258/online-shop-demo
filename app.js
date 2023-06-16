const express = require("express");
const path = require("path");
const fs = require("fs");
const csrf = require("csurf");

const db = require("./data/database/database");

// config
const config_database = require("./config/config.database")
const config_server = require("./config/config.server")

//routes
const routes_auth = require("./routes/routes.auth");
const routes_default = require("./routes/routes.default");
const routes_admin = require("./routes/routes.admin");
const routes_products = require("./routes/routes.products");
const routes_cart = require("./routes/routes.cart");
const routes_orders = require("./routes/routes.orders");

const middleware_add_csrf_token = require("./middlewares/add-csrf-token");
const middleware_express_session = require("./middlewares/express-session");
const middleware_handle_error = require("./middlewares/handle-error");
const middleware_check_auth = require("./middlewares/check-auth");
const middleware_check_admin = require("./middlewares/check-admin");
const middleware_check_cart = require("./middlewares/check-cart");

const app = express();

app.set("views", path.join(__dirname, "view"));
app.set("view engine", "ejs");

// middlewares
app.use(express.static("public"));
app.use("/products/assets/images", express.static("data/images/products"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // for parsing json data


// app.use(middleware_handle_error);
app.use(middleware_express_session);
app.use(csrf());
app.use(middleware_add_csrf_token);
app.use(middleware_check_cart);
app.use(middleware_check_auth);

// routes
app.use("/", routes_default);
app.use("/", routes_auth);
app.use("/", routes_products);
app.use("/", routes_orders);
app.use("/cart", routes_cart);
app.use(middleware_check_admin);
app.use("/admin", routes_admin);


db.connectDB()
    .then(function () {
        app.listen(config_server.portal);
    })
    .catch(function (error) {
        console.log("Failed to connect to the database!");
        console.log(error);
    });
