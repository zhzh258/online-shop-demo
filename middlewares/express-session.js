const Cart = require("../model/model.cart")

const session = require("express-session");
const config_session = require("../config/config.session");

const store = config_session.store(session);
const middleware_express_session = session(config_session.config(store));

module.exports = middleware_express_session;