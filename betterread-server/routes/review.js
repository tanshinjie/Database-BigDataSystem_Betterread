const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { MongoClient } = require('mongodb');
const MongoConnection = require('../MongoConnect')

//Connection to MongoDB
MongoConnection.connectToDB();

router.use((async(req, res, next) => {
  // TODO: Log HTTP request to MongoDB
  const logs = req.body
  console.log(logs);
  try{
      const collection = client.db('dblogs').collection('logsRecord')
      const result = {
        "timeStamp":{
            "type":"Date",
            "default":logs.timeStamp 
        },
        "reqType":{
            
        },
        "responseCode":{
            
        }
    }
      await collection.insertOne(result)
      //console.log("Successfully inserted to database:", logs)
     
      res.status(200).send()
  }catch(error){
    console.log(error)
      res.status(500).send()
  }
  console.log("Logging request to MongoDB");
  next();
}));



router.get("/", (req, res) => {
  // TODO: Get first 100 books in database from MongoDB
  
  const dbName = client.db('dbproj')
  try{
    dbName.collection("firstcollection").find().limit(100).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    res.send(result);
    //res.send("Getting first 100 books from MongoDB");
  });
      }
  catch(error){
    console.log(error)
    res.status(404).send()
  }
  

});

router.get("/review/:asin", (req, res) => {
  // TODO: Get reviews of book given asin from MySQL
  res.send(
    "Get list of reviews for book with asin from MySQL " + req.params.asin
  );
});

router.post("/addbook", async(req, res) => {
  
  // TODO: Add book to mongoDB

  try{
      //const collection = client.db('dbproj').collection('firstcollection')
      const { author, title } = req.body;
      console.log(author, title);
      const collection = client.db('dbproj').collection('firstcollection')
      collection.insertOne({ author, title })
      res.status(201).send({messages:'Added book to MongoDB'})
  }catch(error){
    console.log(error)
      res.status(500).send()
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
