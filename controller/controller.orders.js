const Order = require("../model/model.order")
const Cart = require("../model/model.cart")
const User = require("../model/model.user")
const util = require("../util/util.orders")
const config_stripe = require("../config/config.stripe")
const config_server = require("../config/config.server") 

const stripe = require('stripe')(config_stripe.key);

async function get_orders(req, res){
    const uid = res.locals.uid;
    console.log(uid);
    const orders = await Order.find_all_by_uid(uid);
    console.log(orders);
    res.render("customer/orders/orders", {orders: orders});
}

// checkout
async function post_orders(req, res, next){
    const cart = res.locals.cart;
    const uid = res.locals.uid;
    let user;
    try{
        user = await User.get_user_by_id(uid);
    } catch(error){
        next(error);
        return;
    }
    delete user.password; // drop the hashed password

    
    
    const order = new Order(cart, user); // note: the cart() and user() here is not like the original class
    util.erase_mongodb_id(order)

    try{
        await order.store_in_DB(); // store the order
    } catch(error){
        throw(error);
    }
    // clear the session.cart
    req.session.cart = null;


    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: order.cart.items.map(function(item){
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.product.name
                    },
                    unit_amount_decimal: +item.product.price,
                },
                quantity: +item.quantity,
            }
        }),
        mode: 'payment',
        success_url: `${config_server.url}:${config_server.portal}/success`,
        cancel_url: `${config_server.url}:${config_server.portal}/cancel`,
      });
    
    res.redirect(303, session.url);
}


function get_success(req, res){
    res.render("customer/orders/success")
}

function get_cancel(req, res){
    res.render("customer/orders/cancel")
}

module.exports = {
    get_orders: get_orders,
    post_orders: post_orders,
    get_success: get_success,
    get_cancel: get_cancel,

}