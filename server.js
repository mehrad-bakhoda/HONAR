//Dependencies & Requirements
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");
const app = express();
const formidable = require("formidable");
const session = require("express-session");
const { functionsIn } = require("lodash");
const { response } = require("express");
var expressValidator = require("express-validator");
const validator = require("validator");
// const user = require("./user");
const path = require("path");
const fs = require("fs");
const MongoStore = require("connect-mongo")(session);
const router = express.Router();
require("dotenv").config();
const Jimp = require("jimp");

//schemas
var User = require(__dirname + "/models/user.js");
var Product = require(__dirname + "/models/product.js");
//routes
var routes = require(__dirname + "/routes/routes.js");

const PORT = process.env.PORT || 3000;

const run = async () => {
  await mongoose.connect(
    process.env.DATABASE_ADDRESS,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }
  );

  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
      limit: "50mb",
    })
  );
  //Setting EJS as our view engine that fetches ejs files from views folder
  app.set("view engine", "ejs");
  app.use(
    express.json({
      limit: "50mb",
    })
  );

  //Using bodyParser

  var db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));

  db.once("open", function () {});

  //session and cookies
  app.use(
    session({
      secret: process.env.SESSION_KEY,
      resave: true,
      saveUninitialized: false,
      store: new MongoStore({
        mongooseConnection: db,
      }),
      cookie: { maxAge: 180 * 60 * 1000 },
    })
  );

  //Adding public folder as a static source of our project
  app.use(express.static("public"));
  app.use(function (req, res, next) {
    res.locals.usersession = req.session.userId;
    res.locals.session = req.session;
    next();
  });
  app.use("/uploads", express.static("uploads"));

  app.use("/", routes);

  //Opening and starting our server on port
  app.listen(PORT, () => console.log("Server started on port", PORT));
};
module.exports = run;
