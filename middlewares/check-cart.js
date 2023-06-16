const Cart = require("../model/model.cart")

// store Cart in locals (create || from session)
function middleware_check_cart(req, res, next){
    // req.session.cart: Cart()
    
    if(!req.session.cart){// no previous cart in the session
        res.locals.cart = new Cart();
    } else{ // previous cart in the session
        res.locals.cart = new Cart(req.session.cart.items);
    }
    next();
}

module.exports = middleware_check_cart;