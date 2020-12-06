const express = require("express");
const router = express.Router();
const { mongoClient, mysqlClient } = require("./database");

COUNT_LIMIT = 3000;

router.get("/", (req, res) => {
  console.log("GET /");
  let filterParams = req.query.data;
  filterParams = filterParams ? JSON.parse(filterParams) : {};
  const { search, categories, ratings } = filterParams;
  const ratingQuery = getRatings(ratings);
  const dbMeta = mongoClient.db("dbMeta");

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
        .collection("kindle_metadata")
        .aggregate(pipeline)
        .limit(COUNT_LIMIT)
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
            req.resCode = 200;
            LOG(req);
            return res.status(200).send(data);
          });
        });
    } catch (error) {
      req.resCode = 404;
      LOG(req);
      return res.status(404).send(error);
    }
  } else {
    let query = `SELECT asin, count(*) as numberOfReview, avg(overall) as overall from reviews where ${ratingQuery} group by asin;`;
    mysqlClient.query(query, (err, result) => {
      if (err) return res.status(404).send(err);
      let asinArr = result.map((res) => res["asin"]);
      asinArr = asinArr.slice(0, COUNT_LIMIT);
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
        .collection("kindle_metadata")
        .aggregate(pipeline)
        .toArray((err, titleAuthorDocs) => {
          if (err) {
            req.resCode = 404;
            LOG(req);
            return res.status(404).send(err);
          }
          const data = titleAuthorDocs.map((doc) => {
            let found = result.filter((res) => res["asin"] === doc["asin"]);
            return { ...found[0], ...doc };
          });
          req.resCode = 200;
          LOG(req);
          return res.status(200).send(data);
        });
    });
  }
});

router.get("/review", (req, res) => {
  console.log("GET /review");
  const asin = req.query.asin;
  mysqlClient.query(
    'SELECT reviewerName,reviewText,summary,overall,unixReviewTime FROM reviews WHERE asin = "' +
      asin +
      '" ',
    (err, results) => {
      if (err) {
        req.resCode = 500;
        LOG(req);
        return res.status(500).send(err);
      } else {
        req.resCode = 200;
        LOG(req);
        return res.json({
          reviews: results,
        });
      }
    }
  );
});

router.get("/book", async (req, res) => {
  console.log("GET /book");
  const { asin, brief } = req.query;
  const coll = mongoClient.db("dbMeta").collection("kindle_metadata");
  if (brief) {
    coll
      .find({ asin: asin })
      .project({ asin: 1, title: 1, author: 1, imUrl: 1, categories: 1 })
      .toArray((err, docs) => {
        const doc_ = docs[0];
        const query = `SELECT asin, count(*) as numberOfReview, avg(overall) as overall from reviews where asin='${asin}' group by asin;`;
        mysqlClient.query(query, (err, results) => {
          if (results.length > 0) {
            doc_["numberOfReview"] = 0;
            doc_["overall"] = 0;
            req.resCode = 200;
            LOG(req);
            return res.status(200).send(doc_);
          } else {
            doc_["numberOfReview"] = results[0].numberOfReview;
            doc_["overall"] = results[0].overall;
            req.resCode = 200;
            LOG(req);
            return res.status(200).send(doc_);
          }
        });
      });
  } else {
    coll.find({ asin: asin }).toArray((err, docs) => {
      const doc_ = docs[0];
      const ab = doc_.related.also_bought;
      const bav = doc_.related.buy_after_viewing;
      coll
        .find({ asin: { $in: ab } })
        .project({ asin: 1, title: 1, imUrl: 1 })
        .toArray((err, result) => {
          doc_.related.also_bought = result;
          coll
            .find({ asin: { $in: bav } })
            .project({ asin: 1, title: 1, imUrl: 1 })
            .toArray((err, result) => {
              doc_.related.buy_after_viewing = result;
              const query = `SELECT asin, count(*) as numberOfReview, avg(overall) as overall from reviews where asin='${asin}' group by asin;`;
              mysqlClient.query(query, (err, results) => {
                if (results.length > 0) {
                  doc_["numberOfReview"] = results[0].numberOfReview;
                  doc_["overall"] = results[0].numberOfReview;
                  return res.status(200).send(doc_);
                } else {
                  doc_["numberOfReview"] = 0;
                  doc_["overall"] = 0;
                  return res.status(200).send(doc_);
                }
              });
            });
        });
    });
  }
});

router.post("/book", async (req, res) => {
  console.log("POST /book");
  try {
    const { author, title, description } = req.body;
    const collection = mongoClient.db("dbMeta").collection("kindle_metadata");
    collection.insertOne({ author, title, description }).then((result) => {
      req.resCode = 201;
      LOG(req);
      return res.status(201).send({ messages: "Added book to MongoDB" });
    });
  } catch (error) {
    req.resCode = 500;
    LOG(req);
    return res.status(500).send(error);
  }
});

router.post("/review", (req, res) => {
  console.log("POST /book");
  const { summary, review, asin, overall, name } = req.body;
  const timestamp = Date.now();
  const query =
    "INSERT INTO reviews (asin, reviewerName, reviewText, summary, overall, reviewTime) VALUES ?";
  const values = [[asin, name, review, summary, overall, timestamp]];
  mysqlClient.query(query, [values], function (err, result) {
    if (err) {
      req.resCode = 500;
      LOG(req);
      return res.status(500).send({ messages: "Fail to add review" });
    }
    req.resCode = 201;
    LOG(req);
    return res.status(201).send({ messages: "New review added to MySQL!" });
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

async function LOG(req) {
  console.log("LOG");
  try {
    const collection = mongoClient.db("dblogs").collection("logsRecord");
    const result = {
      timeStamp: Date.now(),
      reqType: req.method,
      resCode: req.resCode,
      path: req.path,
      url: req.url,
    };
    console.log(result);
    await collection.insertOne(result);
  } catch (error) {
    console.log(error);
  }
}
