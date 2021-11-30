//Modules

//Public modules
var express = require("express");
require("dotenv").config();


//Database Models
var Message = require("../../../models/message");

//local modules
const newDate = require("../../../localModules/date.js");


//Code

export default(req,res)=>{
    if (req.session.userId == 0) {
        Message.find({ answered: true }, function (err, rMessages) {
          Message.find({ answered: false }, function (err, messages) {
            res.render("adminMessages", {
              messages: messages,
              rMessages: rMessages,
              date: newDate,
            });
          });
        });
      } else {
        res.redirect("/admin/login");
      }
};