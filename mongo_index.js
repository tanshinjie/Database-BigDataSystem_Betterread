const { MongoClient } = require("mongodb");
const uri =
  "mongodb://admin:password@localhost:27017/";
const mongoClient = new MongoClient(uri, { useUnifiedTopology: true });

const connectToMongo = async () => {
  try {
    await mongoClient.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
};
connectToMongo();
// Connect to the db

const collection = mongoClient.db("dbMeta").collection("kindle_metadata");
collection.dropIndexes();
    
collection.createIndex(
    {
      title: "text",
      author: "text"
    },{ sparse: true }
  )
collection.createIndex( { asin: 1 },{ sparse: true } )  
setTimeout((function() {
    return process.exit(22);
  }), 10000);


