//Modules
//Local modules
const discountGenerator = require("../../../localModules/discountGenerator.js");
const newDate = require("../../../localModules/date.js");

//Public Modules
var express = require("express");
require("dotenv").config();

//Database models
var User = require("../../../models/user");
var Discount = require("../../../models/discount");

//Code

export default (req,res)=>{
    var c;
    Discount.findOne({}, function (err, data) {
      if (data) {
        c = data.unique_id + 1;
      } else {
        c = 1;
      }
      User.findOne({ unique_id: req.session.userId }, function (err, found) {
        if (!err) {
          if (found) {
            const discount = new Discount({
              amount: req.body.amount,
              fromDate: req.body.fromDate,
              toDate: req.body.toDate,
              unique_id: c,
              userId: found.unique_id,
              code: discountGenerator.getDiscount().toString(),
              date: new Date(),
            });
            discount.save(function (err, docs) {
              if (!err) {
                console.log("message sent");
                let discountCreated = {
                  message: `discount code added`,
                  code: "000",
                  date: newDate(new Date()),
                };
                User.updateOne(
                  {
                    unique_id: req.session.userId,
                  },
                  {
                    $push: { message: discountCreated },
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