const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 5000;

app.use(cors());
app.use(express.json());

const api = require("./api");

app.use("/api", api);

app.listen(PORT, () => {
  console.log("API server is running on port:", PORT);
});
