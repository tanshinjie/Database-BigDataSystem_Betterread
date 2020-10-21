const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 5000;

app.use(cors());
app.use(express.json());

const review = require("./routes/review");

app.use("/", review);

app.listen(PORT, () => {
  console.log("server is running on", PORT);
});
