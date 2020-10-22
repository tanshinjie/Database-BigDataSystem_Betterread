const express = require("express");
const router = express.Router();

let mysql = require('mysql');
let connection = mysql.createConnection({
    host: '54.166.186.251',
    port: 3340,
    user: 'shinjie',
    password: 'shinjie',
    database: 'kindle_reviews'
});
connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
  
    console.log('Connected to the MySQL server.');
});


router.use((req, res, next) => {
  // TODO: Log HTTP request to MongoDB
  console.log("Logging request to MongoDB");
  next();
});

router.get("/", (req, res) => {
  // TODO: Get first 100 books in database from MongoDB
  res.send("Getting first 100 books from MongoDB");
});


router.get("/review/:asin", (req, res) => { 
  // TODO: Get reviews of book given asin from MySQL
  const asinNumber = req.params.asin

  console.log("Get list of reviews for book with asin from MySQL " + asinNumber)
  
  connection.query('SELECT reviewText FROM reviews WHERE asin = "' + asinNumber +'" '  ,(err,results) => { //callback function 
    if(err) {
      return res.send(err)
    }
    else {
      
      return res.json({
      data: results
    
      })
    }
  })

  
});



router.post("/addbook", (req, res) => {
  const { author, title } = req.body;
  console.log(author, title);
  // TODO: Add book to mongoDB
  res.send("Added book to MongoDB");
});

router.post("/addreview", (req, res) => {
  const { summary, review, asin, ratings, reviewer } = req.body;
  const timestamp = Date.now();
  console.log(summary, review, asin, ratings, reviewer, timestamp);
  // TODO: Add review of a book to MySQL
  res.send("Added review to MySQL database");
});

module.exports = router;
