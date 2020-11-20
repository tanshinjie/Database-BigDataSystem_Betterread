const mysql = require("mysql");
const { MongoClient } = require("mongodb");
const uri =
  "mongodb://root:12345@ec2-3-238-114-70.compute-1.amazonaws.com:27017";
const mongoClient = new MongoClient(uri, { useUnifiedTopology: true });

const connectToMongo = async () => {
  try {
    await mongoClient.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
};

const mysqlClient = mysql.createConnection({
  host: "54.166.186.251",
  port: 3340,
  user: "shinjie",
  password: "shinjie",
  database: "kindle_reviews",
});

const connectToMySQL = async () => {
  try {
    await mysqlClient.connect();
    console.log("Connected to MySQL");
  } catch (error) {
    console.error(error);
  }
};

connectToMongo();
connectToMySQL();
module.exports.mongoClient = mongoClient;
module.exports.mysqlClient = mysqlClient;
