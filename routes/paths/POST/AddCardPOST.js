//Modules

//Local modules
const newDate = require("../../../localModules/date.js");

//Public Modules
var express = require("express");
require("dotenv").config();

//Database models
var User = require("../../../models/user");
var CreditCard = require("../../../models/creditCard");

//Code

export default (req,res)=>{
    User.updateOne(
        { unique_id: req.session.userId },
        { creditCardConfirmation: "wait" },
        function (err) {
          if (!err) {
            console.log("waiting for confirmation");
          }
        }
      );
      User.findOne({ unique_id: req.session.userId }, function (err, found) {
        if (!err) {
          if (found) {
            const creditCard = new CreditCard({
              cardNumber: req.body.cardNumber,
              name: req.body.name,
              sId: req.body.sId,
              user: found,
              date: new Date(),
            });
            creditCard.save(function (err, docs) {
              if (!err) {
                console.log("credirCard added");
                let cardAdded = {
                  message: `card added`,
                  code: "000",
                  date: newDate(new Date()),
                };
                User.updateOne(
                  {
                    unique_id: req.session.userId,
                  },
                  {
                    $push: { message: cardAdded },
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
};