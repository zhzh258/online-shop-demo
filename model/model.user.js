const mongodb = require("mongodb");
const db = require("../data/database/database")
const bcriptjs = require("bcryptjs");

class User{
    constructor(email, password, first_name, last_name, phone_number, shipping_address){
        this.email = email;
        this.password = password;
        this.first_name = first_name;
        this.last_name = last_name;
        this.phone_number = phone_number;
        this.shipping_address = shipping_address;
    }

    // 1. at POST login
    // 2. at GET login
    init_with_req(req){
        this.email = req.body.email,
        this.password = req.body.password,
        // the following might be undefined
        this.first_name = req.body['first-name'],
        this.last_name = req.body['last-name'],
        this.phone_number = req.body['phone-number'],
        this.shipping_address = req.body['shipping-address']
    }

    async encrypt(){
        this.password = await bcriptjs.hash(this.password, 12);
    }

    // 1. store user in database
    // 2. append the allocated "_id" to 'this'
    async store_in_DB(){ 
        await db.getDB().collection("users").insertOne(this);
        const existingUser = await db.getDB().collection("users").findOne({email: this.email});
        this._id = existingUser._id;
    }

    // 1. if occupied, return _id
    // 2. if not, return false
    static async is_occupied(email){
        const existingUser = await db.getDB().collection("users").findOne({email: email});
        if(existingUser){
            return existingUser._id;
        } else{
            return false;
        }
    }

    // get a user from database by "user._id"
    // 1. id here must be string
    // 2. if found, return a User()
    // 3. if not found, return false
    static async get_user_by_id(id){
        const _id = new mongodb.ObjectId(id);
        
        let existingUser;
        try{
            existingUser = await db.getDB().collection("users").findOne({_id: _id});
        } catch(error){
            throw(error);
        }
        
        if(existingUser){
            return existingUser;
        } else{
            return false;
        }
    }

    // get a user from database by "user.email"
    // 2. if found, return a User()
    // 3. if not found, return false
    static async get_user_by_email(email){
        const existingUser = await db.getDB().collection("users").findOne({email: email});
        if(existingUser){
            return existingUser;
        } else{
            
            return false;
        }
    }

    async is_password_matching(){
        
    }

    async is_password_correct(){
        const existingUser = await db.getDB().collection("users").findOne({email: this.email});
        return bcriptjs.compare(this.password, existingUser.password);
    }
}

module.exports = User;