const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require('path')
const dotenv = require("dotenv");
const { getPool } = require("./db/db");
const routes = require("./routes/routes");
const app = express();
dotenv.config();

getPool();



// // app.use(express.static(path.join("/", __dirname)))
 app.use('/uploads', express.static('uploads'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**************cors orgin*************/
app.use(cors());
app.all("/*", function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );
  if (req.method == "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }
});

app.use("/api", routes);


module.exports = app;
