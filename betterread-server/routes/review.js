const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const MongoConnection = require("../MongoConnect");
//Connect to MongoDB
MongoConnection.connectToDB();
const client = MongoConnection.client;

let mysql = require("mysql");
let connection = mysql.createConnection({
  host: "54.166.186.251",
  port: 3340,
  user: "shinjie",
  password: "shinjie",
  database: "kindle_reviews",
});
connection.connect(function (err) {
  if (err) {
    return console.error("error: " + err.message);
  }

  console.log("Connected to the MySQL server.");
});

router.all("*", async (req, res, next) => {
  // TODO: Log HTTP request to MongoDB
  const logs = req.body;
  console.log(logs);
  try {
    const collection = client.db("dblogs").collection("logsRecord");
    let time = Date.now;
    console.log(time);
    const result = {
      timeStamp: {
        type: "Date",
        default: new Date(),
      },
      reqType: {
        type: "String",
        default: logs.reqType,
      },
      responseCode: {
        type: "Number",
        default: logs.responseCode,
      },
    };
    await collection.insertOne(result);
    console.log("Successfully inserted to database:", logs);

    next();
  } catch (error) {
    // console.log(error);
    res.status(500).send();
    return;
  }
  console.log("Logging request to MongoDB");
});

router.get("/", (req, res) => {
  // TODO: Get first 100 books in database from MongoDB
  // Get data with author and title , limiting to 100
  const filterParams = req.query;
  console.log(filterParams);
  const dbName = client.db("dbproj");
  try {
    var query = { author: { $exists: true }, title: { $exists: true } };
    dbName
      .collection("firstcollection")
      .find(query)
      .limit(100)
      .toArray(function (err, result) {
        //res.send("Getting first 100 books from MongoDB");
        console.log(result);
        res.send(result);
        res.status(200).send();
        //res.send("Getting first 100 books from MongoDB");
        //return result;
      });
  } catch (error) {
    console.log(error);
    res.status(404).send();
  }
});

router.get("/review/:asin", (req, res) => {
  // TODO: Get reviews of book given asin from MySQL
  const asinNumber = req.params.asin;

  console.log(
    "Get list of reviews for book with asin from MySQL " + asinNumber
  );

  connection.query(
    'SELECT reviewerName,reviewText,summary,overall,unixReviewTime FROM reviews WHERE asin = "' +
      asinNumber +
      '" ',
    (err, results) => {
      //callback function
      if (err) {
        return res.send(err);
      } else {
        return res.json({
          reviews: results,
        });
      }
    }
  );
});

router.post("/addbook", async (req, res) => {
  // TODO: Add book to mongoDB

  try {
    //const collection = client.db('dbproj').collection('firstcollection')
    const { author, title, description } = req.body;
    console.log(author, title, description);
    const collection = client.db("dbproj").collection("firstcollection");
    collection.insertOne({ author, title });
    res.status(201).send({ messages: "Added book to MongoDB" });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.post("/addreview", (req, res) => {
  const { summary, review, asin, ratings, reviewer } = req.body;
  const timestamp = Date.now();
  console.log(summary, review, asin, ratings, reviewer, timestamp);
  // TODO: Add review of a book to MySQL
  res.send("Added review to MySQL database");
});

module.exports = router;
