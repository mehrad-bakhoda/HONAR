//Modules

//Public Modules
var express = require("express");
require("dotenv").config();

//Database models
var User = require("../../../models/user");

//Code

export default(req,res)=>{
    if (req.session.userId) {
        User.findOne({ unique_id: req.session.userId }, function (err, user) {
          if (user.type == "Uploader") res.render("upload");
          else {
            res.redirect("/dashboard&error=notUploader");
          }
        });
      } else {
        res.redirect("/login");
      }
};