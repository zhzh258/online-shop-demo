const Product = require("../model/model.product")
const Cart = require("../model/model.cart")

async function get_cart(req, res){
    const cart = res.locals.cart;
    const items = cart.items;
    console.log(cart);
    res.render("customer/cart/cart", {cart: cart})
}

async function patch_cart_item(req, res){
    const cart = res.locals.cart;
    // data from fetch request
    const id = req.body.id;
    const quantity = req.body.quantity;
    // the index of modified item
    // maybe -1
    // console.log("the cart we got from locals: ", cart)
    // console.log("we are gonna searching in cart, id: ", id)
    const i = cart.update_quantity(id, quantity);
    // console.log("the index i found in cart, it is ", i);
    // console.log("the cart we store in session: ", cart)
    req.session.cart = cart;
    if(i === -1){
        res.status(201).json({
            message: "cart update succeed, please remove item in DOM",
            // to be handled in 'responseData' in cart-management.js
            should_remove: true,
            cart_quantity: cart.quantity(),
            cart_totalPrice: cart.totalPrice(),
            nav_badge: cart.items.length
            //
        })
    } else{
        res.status(201).json({
            message: "cart update succeed, please update item in",
            // to be handled in 'responseData' in cart-management.js
            should_remove: false,
            cart_quantity: cart.quantity(),
            cart_totalPrice: cart.totalPrice(),
            item_price: cart.items[i].product.price,
            item_quantity: cart.items[i].quantity,
            item_sum: cart.items[i].sum,
            nav_badge: cart.items.length
        })
    }
}

async function post_cart_item(req, res, next){
    const id = req.body.id;
    let product;
    try{
        product = await Product.find_by_id(id)
    } catch(error){
        error.message = "cannot find product with id: " + id;
        error.code = 500;
        throw(error);
    }

    // load the Cart() from res.locals
    const cart = res.locals.cart;
    // console.log("the cart loaded from locals: ", cart.items)
    cart.add_item(product);
    // store the Cart() into session
    req.session.cart = cart;
    console.log("quantity: ", cart.quantity())
    res.status(201).json({
        message: "cart update succeed",
        cart_quantity: cart.quantity()
    })

}


module.exports = {
    get_cart: get_cart,
    patch_cart_item: patch_cart_item,
    post_cart_item: post_cart_item
}