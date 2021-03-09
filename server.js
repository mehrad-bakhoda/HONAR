//Dependencies & Requirements
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");
const app = express();
const formidable = require('formidable');
const session = require('express-session');
const { functionsIn } = require("lodash");
const { response } = require("express");
const { check, oneOf } = require('express-validator');
const validator = require('validator')
const user = require("./user");
const path = require("path");
const fs = require("fs");
const MongoStore = require('connect-mongo')(session);
require('dotenv').config();
const router = express.Router();
var User = require(__dirname + "/user.js");

mongoose.connect("mongodb+srv://erfanrmz:Erfan26kh79@cluster0.waub8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});


//Setting EJS as our view engine that fetches ejs files from views folder
app.set('view engine', 'ejs');
app.use(express.json({
  limit: '50mb'
}));

//Using bodyParser
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}));

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
});
app.use(session({
  secret: process.env.SESSION_KEY,
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  }),
  cookie: {maxAge : 180 * 60 * 1000}
}));

//Adding public folder as a static source of our project
app.use(express.static("public"));


app.use(function(req, res, next) {
  res.locals.usersession = req.session.userId;
  res.locals.session = req.session;
  next();
});



//Opening and starting our server on port 3000
app.listen(3000, function() {
  console.log("Server started on port 3000");
});




app.get("/",function(req,res){
  res.render("home");
});
