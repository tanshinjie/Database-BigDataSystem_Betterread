const express = require('express')
const app = express()
const PORT = 5000

app.use(express.json())
const review = require('./routes/review')

app.use('/',review)

app.listen(PORT, () => {
  console.log("server is running on", PORT);
});
