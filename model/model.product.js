const db = require("../data/database/database")
const mongodb = require("mongodb")

class Product{
    constructor(productData){
        this._id = productData._id; // ObjectId()
        this.name = productData.name;
        this.imageFileName = productData.imageFileName; // uuid.v4() + "-"  + file.originalname
        this.imageFilePath = `data/images/products/${productData.imageFileName}`;
        this.imageFileSrc = `/products/assets/images/${productData.imageFileName}`// ???
        this.price = +productData.price;
        this.description = productData.description
    }

    async store_in_DB(){
        if(this._id){
            this.update_in_DB();
        }
        let productData = {
            name: this.name,
            imageFileName: this.imageFileName, // uuid.v4() + "-"  + file.originalname
            price: this.price,
            description: this.description
        }
        this._id = await db.getDB().collection("products").insertOne(productData);
    }

    async update_in_DB(){
        // if this._id exists but there's no such data in DB
        if(!await db.getDB().collection("products").findOne(this._id)){
            const error = "this._id exists but there's no such data in DB"
            error.code = 404;
            throw(error);
        }
        // else
        let productData = {
            name: this.name,
            imageFileName: this.imageFileName, // uuid.v4() + "-"  + file.originalname
            price: this.price,
            description: this.description
        }
        db.getDB().collection("products").updateOne({_id: this._id}, {
            $set: productData,
        })

    }
        
    // input: string id
    // output: 1 - if found: a Product()    2 - unfound: undefined
    static async find_by_id(id){
        let productData;
        try{
            const _id = new mongodb.ObjectId(id); // string -> ObjectId()
            productData = await db.getDB().collection("products").findOne({_id: _id});
        } catch(error){
            error.code = 500;
            error.message = `failed to look for id: ${id} in database`;
            throw(error);
        }
        
        if(productData){
            return new Product(productData);
        } else{
            return undefined;
        }
    }

    // output: an array of Product()    [product_01, product_02, ...]
    static async find_all(){
        const arr =  await db.getDB().collection("products").find().toArray(); // [productData_01, productData_02, ...]
        return arr.map(function(productData){
            return new Product(productData);
        })
    }

    // input: string id
    static async delete_by_id(id){
        const _id = new mongodb.ObjectId(id); // string -> ObjectId()
        return await db.getDB().collection("products").deleteOne({_id: _id})
    }
}

module.exports = Product;