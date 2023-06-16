const Product = require("./model.product");

// class Item {
//     constructor(product){
//         this.product = product;
//         this.quantity = 1;
//     }
//      total price of a item
//      totalPrice(){
//     return this.quantity * this.product.price;
// }
function Item(product){
    return{
        product: product,
        quantity: 1,
        sum: product.price
    }
}


class Cart {
    // Cart { items: ..., sum: ...}
    // Cart.items:  [ Item_01, Item_02, ... ]
    // Item: {
    //      Product(),
    //      quantity,
    //      sum
    // }
    constructor(items = []){
        this.items = items;
        this.sum = this.totalPrice();
    }

    // number of different products
    quantity(){
        return this.items.length;
    }

    // total price of the cart
    totalPrice(){
        let res = 0;
        for(const item of this.items){
            res += item.quantity * item.product.price;
        }
        return res;
    }
    
    // input: a product
    // 1. convert the product into a item
    // 2. add item into this.items[]
    add_item(product){
        if(!product){
            return;
        }
        // initialize the item
        const item = Item(product);

        // update or add:
        for(let i = 0; i < this.items.length; i++){
            // // if: existing product._id in shopping cart -> update
            // console.log("The first id", this.items[i].product._id)
            // console.log("The second id", product._id)
            if(this.items[i].product._id.toString() === product._id.toString()){
                // console.log("if")
                this.items[i].quantity += 1;
                this.items[i].sum += this.items[i].product.price;
                this.sum = this.totalPrice();
                return;
            }
        }
            // else: no such product in shopping cart -> add
        // console.log("else")
        this.items.push(item);
        this.sum = this.totalPrice();
    }

    // input:   1. id (string) of the product to update       2. quantity (number!!!!)
    // output:  if: 'i'  of modified items[i]   else if: -1
    update_quantity(id, quantity){
        quantity = +quantity;
        for(let i = 0; i < this.items.length; i++){
            if(this.items[i].product._id.toString() === id && quantity > 0){
                this.items[i].quantity = quantity;
                this.items[i].sum = quantity * this.items[i].product.price;
                this.sum = this.totalPrice();
                return i;
            } else if(this.items[i].product._id.toString() === id && quantity <= 0){
                this.items.splice(i, 1);
                this.sum = this.totalPrice();
                return -1;
            }
        }
        console.log("the shall not happen")
    }
}


module.exports = Cart;