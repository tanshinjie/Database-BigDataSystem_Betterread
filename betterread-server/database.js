const os = require("os");
const fs = require("fs");
const path = require("path");
const mysql = require("mysql");
const { MongoClient } = require("mongodb");

ip_list = JSON.parse(
  fs.readFileSync(path.resolve(os.homedir(), "ip_list.json"), "utf-8")
);
console.log("ip_list", ip_list);

const URI = `mongodb://admin:password@${ip_list.mongodb_ip}:27017`;
const mysqlClient = mysql.createConnection({
  host: `${ip_list.mysql_ip}`,
  port: 3306,
  user: "admin",
  password: "password",
  database: "kindle_reviews",
});
// const mysqlClient = mysql.createConnection({
//   host: `${ip_list.mysql_ip}`,
//   port: 3340,
//   user: "shinjie",
//   password: "shinjie",
//   database: "kindle_reviews",
// });
const mongoClient = new MongoClient(URI, { useUnifiedTopology: true });

mysqlClient.connect((err) => {
  if (err) return console.log(err);
  console.log("Connecting to MySQL...");
});
try {
  mongoClient.connect();
  console.log("Connecting to Mongo...");
} catch (error) {
  console.log(error);
}

module.exports.mysqlClient = mysqlClient;
module.exports.mongoClient = mongoClient;
