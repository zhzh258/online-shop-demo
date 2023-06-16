const { MongoClient, ServerApiVersion } = require('mongodb');
const config_database = require("../../config/config.database")

const uri = config_database.url;
// const uri = "mongodb+srv://zzh:<doo1YnKEkXsFEojN>@cluster0.o4yext9.mongodb.net/?retryWrites=true&w=majority";
//doo1YnKEkXsFEojN

// MONGODB_URI from the environment
// if(process.env.MONGODB_URI){
//     uri = process.env.MONGODB_URI
// }
let database;

async function connectDB() {
    const client = await MongoClient.connect(uri);
    database = client.db("online-shop");
    if (!database) {
        throw new Error("Failed to connect to atlas!");
    }
}

function getDB() {
    if (!database) {
        throw new Error("Failed to connect to the database!");
    }
    return database;
}

module.exports = {
    connectDB: connectDB,
    getDB: getDB,
};



// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });
// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

// const client = new MongoClient(uri);
// async function run() {
//   try {
//     const database = client.db('admin');
//     const movies = database.collection('movies');
//     // Query for a movie that has the title 'Back to the Future'
//     const query = { title: 'Back to the Future' };
//     const movie = await movies.findOne(query);
//     console.log(movie);
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);