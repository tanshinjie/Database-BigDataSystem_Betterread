const { MongoClient } = require("mongodb");
const uri =
  "mongodb://root:12345@ec2-3-238-114-70.compute-1.amazonaws.com:27017";
const client = new MongoClient(uri, { useUnifiedTopology: true });

const connectToDB = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error(e);
  }
};

connectToDB();

client.db("dbMeta").collection("title_author").createIndex({
  title: "text",
  author: "text",
});

client.db("dbMeta").collection("title_author").createIndex({
  asin: 1,
});

client.db("dbMeta").collection("metadata").createIndex({
  asin: 1,
});

module.exports.client = client;
