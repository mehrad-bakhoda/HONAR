//Modules

//Local modules
const newDate = require("../../../localModules/date.js");

//Public Modules
var express = require("express");
require("dotenv").config();

//Database models
var User = require("../../../models/user");
var Message = require("../../../models/message");

//Code

export default(req,res)=>{
    var c;
    Message.findOne({}, function (err, data) {
      if (data) {
        c = data.unique_id + 1;
      } else {
        c = 1;
      }
      User.findOne({ unique_id: req.session.userId }, function (err, found) {
        if (!err) {
          if (found) {
            const message = new Message({
              message: req.body.message,
              user: found,
              unique_id: c,
              date: new Date(),
              answered: false,
            });
            message.save(function (err, docs) {
              if (!err) {
                console.log("message sent");
                let messageSent = {
                  message: `message sent`,
                  code: "000",
                  date: newDate(new Date()),
                };
                User.updateOne(
                  {
                    unique_id: req.session.userId,
                  },
                  {
                    $push: { message: messageSent },
                  },
                  function (err) {
                    if (!err) {
                      console.log("added status");
                    }
                  }
                );
                res.redirect("/dashboard");
              } else {
                console.log(err);
                res.redirect("/dashboard");
              }
            });
          }
        }
      });
    })
      .sort({ _id: -1 })
      .limit(1);
};