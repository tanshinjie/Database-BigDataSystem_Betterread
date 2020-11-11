const express = require("express");
const router = express.Router();
const { client } = require("../MongoConnect");

const mysql = require("mysql");
const mysqlClient = mysql.createConnection({
  host: "54.166.186.251",
  port: 3340,
  user: "shinjie",
  password: "shinjie",
  database: "kindle_reviews",
});
mysqlClient.connect(function (err) {
  if (err) {
    return console.error("error: " + err.message);
  }
  console.log("Connected to the MySQL server");
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
    res.status(500).send(error);
    return;
  }
  console.log("Logging request to MongoDB");
});

router.get("/", (req, res) => {
  const filterParams = req.query.data;
  const { search, categories, ratings } = JSON.parse(filterParams);
  const dbMeta = client.db("dbMeta");
  try {
    const pipeline = [
      {
        $lookup: {
          from: "metadata",
          localField: "asin",
          foreignField: "asin",
          as: "metadata",
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [{ $arrayElemAt: ["$metadata", 0] }, "$$ROOT"],
          },
        },
      },
      {
        $project: {
          metadata: 0,
        },
      },
    ];
    if (categories.length > 0) {
      pipeline.unshift({
        $match: {
          categories: {
            $in: categories,
          },
        },
      });
    }
    if (search != "") {
      pipeline.unshift({
        $match: {
          $text: { $search: search },
        },
      });
    }

    dbMeta
      .collection("title_author")
      .aggregate(pipeline)
      .limit(50)
      .toArray((err, titleAuthorDocs) => {
        if (err) throw err;
        let minRating = 0;
        for (const [key, value] of Object.entries(ratings)) {
          if (value) {
            minRating = key;
          }
        }
        const promiseArr = sqlQueryReviewCount([...titleAuthorDocs], minRating);
        Promise.all(promiseArr)
          .then((result) => {
            const finalResult = result.filter((res) => res !== null);
            res.status(200).send(finalResult);
          })
          .catch((error) => {
            res.status(404).send(error);
          });
      });
  } catch (error) {
    res.status(404).send(error);
  }
});

function sqlQueryReviewCount(titleAuthorDocs, minRating) {
  const promiseArr = [];
  for (let i = 0; i < titleAuthorDocs.length; i++) {
    const titleAuthorDoc = titleAuthorDocs[i];
    const asin = titleAuthorDoc["asin"];
    promiseArr.push(
      new Promise((resolve, reject) => {
        let query = `SELECT asin, count(*) as numberOfReview, avg(overall) as overall from reviews where asin="${asin}" group by asin `;
        mysqlClient.query(query, (error, result) => {
          if (error) reject(error);
          if (minRating > 0) {
            if (result.length > 0) {
              if (result[0]["overall"] >= minRating) {
                titleAuthorDoc["numOfReview"] = JSON.parse(
                  JSON.stringify(result[0]["numberOfReview"])
                );
                titleAuthorDoc["ratings"] = JSON.parse(
                  JSON.stringify(result[0]["overall"])
                );
                resolve(titleAuthorDoc);
              } else {
                resolve(null);
              }
            } else {
              resolve(null);
            }
          } else {
            if (result.length > 0) {
              titleAuthorDoc["numOfReview"] = JSON.parse(
                JSON.stringify(result[0]["numberOfReview"])
              );
              titleAuthorDoc["ratings"] = JSON.parse(
                JSON.stringify(result[0]["overall"])
              );
              resolve(titleAuthorDoc);
            } else {
              titleAuthorDoc["numOfReview"] = "0";
              titleAuthorDoc["ratings"] = "0";
              resolve(titleAuthorDoc);
            }
          }
        });
      })
    );
  }
  return promiseArr;
}

router.get("/review/:asin", (req, res) => {
  const asinNumber = req.params.asin;

  console.log(
    "Get list of reviews for book with asin from MySQL " + asinNumber
  );

  mysqlClient.query(
    'SELECT reviewerName,reviewText,summary,overall,unixReviewTime FROM reviews WHERE asin = "' +
      asinNumber +
      '" ',
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        return res.json({
          reviews: results,
        });
      }
    }
  );
});

router.post("/addbook", async (req, res) => {
  try {
    const { author, title, description } = req.body;
    const collection = client.db("dbMeta").collection("title_author");
    collection.insertOne({ author, title, description }).then((result) => {
      console.log(result);
      res.status(201).send({ messages: "Added book to MongoDB" });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.post("/addreview", (req, res) => {
  const { summary, review, asin, overall, name } = req.body;
  const timestamp = Date.now();
  console.log(
    "Inserting review: " + summary,
    review,
    asin,
    overall,
    name,
    timestamp
  );
  var sql =
    "INSERT INTO reviews (asin, reviewerName, reviewText, summary, overall, reviewTime) VALUES ?";
  var values = [[asin, name, review, summary, overall, timestamp]];
  mysqlClient.query(sql, [values], function (err, result) {
    if (err) throw res.status(500).send({ messages: "Fail to add review" });
    console.log("Number of records inserted: " + result.affectedRows);
    res.status(201).send({ messages: "New review added to MySQL!" });
  });
});

module.exports = router;
