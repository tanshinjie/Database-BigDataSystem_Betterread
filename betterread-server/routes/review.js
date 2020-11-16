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
  try {
    const collection = client.db("dblogs").collection("logsRecord");
    const result = {
      timeStamp: {
        type: "Date",
        default: Date.now(),
      },
      reqType: {
        type: "String",
        default: req.method,
      },
    };
    await collection.insertOne(result);

    next();
  } catch (error) {
    res.status(500).send(error);
    return;
  }
});

router.get("/", (req, res) => {
  const filterParams = req.query.data;
  const { search, categories, ratings } = JSON.parse(filterParams);

  const ratingQuery = getRatings(ratings);

  const dbMeta = client.db("dbMeta");

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
    pipeline.push({
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

  if (ratingQuery === "") {
    try {
      dbMeta
        .collection("title_author")
        .aggregate(pipeline)
        .limit(5000)
        .toArray((err, titleAuthorDocs) => {
          if (err) throw err;
          let asinArr = titleAuthorDocs.map((doc) => doc["asin"]);
          asinArr = asinArr.join("','");
          asinArr = "('" + asinArr + "')";

          let query = `SELECT asin, count(*) as numberOfReview, avg(overall) as overall from reviews where asin in ${asinArr} group by asin;`;
          mysqlClient.query(query, (err, result) => {
            if (err) return res.status(404).send(err);
            const data = result.map((res) => {
              let found = titleAuthorDocs.filter(
                (doc) => doc["asin"] === res["asin"]
              );
              return { ...found[0], ...res };
            });
            res.status(200).send(data);
          });
        });
    } catch (error) {
      return res.status(404).send(error);
    }
  } else {
    let query = `SELECT asin, count(*) as numberOfReview, avg(overall) as overall from reviews where ${ratingQuery} group by asin;`;
    mysqlClient.query(query, (err, result) => {
      if (err) return res.status(404).send(err);
      let asinArr = result.map((res) => res["asin"]);
      asinArr = asinArr.slice(0, 10000);
      if (search === "") {
        pipeline.unshift({
          $match: {
            asin: {
              $in: asinArr,
            },
          },
        });
      } else {
        pipeline.splice(1, 0, {
          $match: {
            asin: {
              $in: asinArr,
            },
          },
        });
      }
      dbMeta
        .collection("title_author")
        .aggregate(pipeline)
        .toArray((err, titleAuthorDocs) => {
          if (err) return res.status(404).send(err);
          const data = titleAuthorDocs.map((doc) => {
            let found = result.filter((res) => res["asin"] === doc["asin"]);
            return { ...found[0], ...doc };
          });
          return res.status(200).send(data);
        });
    });
  }
});

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

router.post("/newbook", async (req, res) => {
  try {
    const { author, title, description } = req.body;
    const collection = client.db("dbMeta").collection("title_author");
    collection.insertOne({ author, title, description }).then((result) => {
      console.log(result);
      res.status(201).send({ messages: "Added book to MongoDB" });
    });
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.post("/newreview", (req, res) => {
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

function getRatings(ratings) {
  let ratingsStr = "";
  for (const [key, value] of Object.entries(ratings)) {
    if (value) {
      if (ratingsStr) ratingsStr += " or ";
      ratingsStr += `floor(overall)=${key}`;
    }
  }
  return ratingsStr;
}
