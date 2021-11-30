//Modules

//Public modules
var express = require("express");
require("dotenv").config();


//Database Models
var User = require("../../../models/user");

//local modules
const newDate = require("../../../localModules/date.js");


//Code

export default(req,res)=>{
    if (req.session.userId == 0) {
        User.find({ type: "Uploader" }, function (err, uploader) {
          User.find({ type: "Downloader" }, function (err, downloader) {
            res.render("adminUsers", {
              uploader: uploader,
              downloader: downloader,
              date: newDate,
            });
          });
        });
      } else {
        res.redirect("/admin/login");
      }
};