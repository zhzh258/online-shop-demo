// 1. information of the user: Uid
// 2. information of the Cart Items
// 3. status
// 4. date

const mongodb = require("mongodb")
const Cart = require("./model.cart");
const User = require("./model.user")
const db = require("../data/database/database")

class Order {
    constructor(cart, user){
        this.cart = Object.assign({}, cart);
        this.user = Object.assign({}, user);
        this.status = "pending";
        this.date = new Date().toUTCString();
    }

    async store_in_DB(){
        // console.log("storing Order() into DB...")
        if(this._id){
            return;
        }
        const orderData = {
            cart: this.cart,
            user: this.user,
            status: this.status,
            date: this.date,
        }
        // console.log("the data to be stored: ", orderData)
        // console.log("where items are: ", orderData.cart.items)
        
        let _id;
        try{
            _id = await db.getDB().collection("orders").insertOne(orderData);
        } catch(error){
            throw(error);
        }
        // console.log("storage succeeded")
        this._id = _id;
        return;
    }
    
    static async find_all(){
        const orders = await db.getDB().collection("orders").find({}).sort({_id: -1}).toArray()
        return orders;
    }

    // input: string
    static async find_all_by_uid(uid){
        const orders = await db.getDB().collection("orders").find({"user.id": uid}).sort({_id: -1}).toArray()
        return orders;
    }

    static async update_status_by_id(id, new_status){
        const _id = new mongodb.ObjectId(id);
        await db.getDB().collection("orders").updateOne({_id}, {$set: {status: new_status}});
    }
}

module.exports = Order;