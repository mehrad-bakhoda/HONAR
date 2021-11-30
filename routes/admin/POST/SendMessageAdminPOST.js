//Modules

//Public modules
var express = require("express");
require("dotenv").config();


//Database Models
var User = require("../../../models/user");
var Message = require("../../../models/message");

//local modules
const newDate = require("../../../localModules/date.js");


//Code

export default(req,res)=>{
    Message.updateOne(
        { unique_id: req.params.messageId },
        { response: req.body.response, answered: true, answeredDate: new Date() },
        function (err) {
          if (!err) {
            let messageRecieved = {
              message: `you have recieved a new message`,
              code: "000",
              date: newDate(new Date()),
            };
            User.updateOne(
              { unique_id: req.params.userId },
              { $push: { message: messageRecieved } },
              function (err) {
                if (!err) {
                  console.log("added status");
                  res.redirect("/admin/messages");
                }
              }
            );
          }
        }
      );
};