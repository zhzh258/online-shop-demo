// !!! note: If directly store orderinto mongodb,
// we will fail, having errors in "bson.js"
// because there is a '_id: ObjectId' existing in its children
function erase_mongodb_id(order){
    order.user.id = order.user._id.toString();
    delete order.user._id;

    for(let i = 0; i < order.cart.items.length; i++){
        order.cart.items[i].product.id = order.cart.items[i].product._id.toString();
        delete order.cart.items[i].product._id;
    }
}

module.exports = {
    erase_mongodb_id: erase_mongodb_id,
}