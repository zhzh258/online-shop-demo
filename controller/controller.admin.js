const Product = require("../model/model.product");
const mongodb = require("mongodb");
const Order = require("../model/model.order")

async function get_products(req, res){
    // check session.isAdmin??
    const arr = await Product.find_all(); // [product_01, product_02, ...]
    for(a of arr){
        a._id = a._id.toString(); // product_01._id: from object to string
    }
    res.render("admin/products/products", {products: arr});
}


async function post_products(req, res){
    // console.log(req.body)
    // console.log(req.file)
    const productData = {
        ...req.body,
        imageFileName: req.file.filename
    }
    const product = new Product(productData);
    await product.store_in_DB();

    res.redirect("/admin/products")
}

function get_products_new(req, res){
    // check session.isAdmin??
    res.render("admin/products/products-new");
}

async function get_products_update(req, res, next){
    const id = req.params.id
    const product = await Product.find_by_id(id);
    if(!product){
        const error = "cannot find product with id in database"
        error.code = 404;
        next(error);
        return;
    }
    product._id = product._id.toString();
    // console.log("product to be rendered: ", product)
    res.render("admin/products/products-update", {product: product});
    
}

async function post_products_update(req, res){
//     console.log(req.body);
    const id = req.params.id;
    const productData = {
        ...req.body,
        _id: new mongodb.ObjectId(id)
    }
    const product = new Product(productData);

    // now we have a product with _id
    // 2 cases: with file or without file
    if(req.file){ // replace the old image
        // console.log("have a file")
        product.imageFileName = req.file.filename;
        await product.update_in_DB();
    } else{
        await product.update_in_DB();
    }  
    res.redirect("/admin/products")
    
}

// ajax
async function delete_products(req, res){
    const id = req.params.id;
    Product.delete_by_id(id);
    res.json({message: "The product has been deleted"})
}

async function get_orders(req, res){
    let orders = await Order.find_all();
    orders = orders.map(function(order){
        order.id = order._id.toString();
        return order;
    })
    res.render("customer/orders/orders", {orders: orders});
}

async function post_orders(req, res){
    const id = req.body.id;
    const status = req.body.status;

    await Order.update_status_by_id(id, status);
    
    console.log(id);
    res.status(201).json({
        message: "status updated",
        new_status: status
    })
}


module.exports = {
    get_products: get_products,
    post_products: post_products,
    get_orders: get_orders,
    post_orders: post_orders,
    get_products_new: get_products_new,
    get_products_update: get_products_update,
    post_products_update: post_products_update,
    delete_products: delete_products
}