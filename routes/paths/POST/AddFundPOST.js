//Modules

//Public Modules
var express = require("express");
require("dotenv").config();

//Database models
var User = require("../../../models/user");

//Code

export default(req,res)=>{
    function isNumeric(num) {
        return !isNaN(num);
      }
      if (isNumeric(req.body.amount)) {
        User.findOne({ unique_id: req.session.userId }, function (err, user) {
          if (!user.balance || user.balance === undefined) {
            User.updateOne(
              { unique_id: req.session.userId },
              { balance: parseFloat(req.body.amount).toString() },
              function (err) {
                if (!err) {
                  res.redirect("dashboard");
                }
              }
            );
          } else {
            const currentAmount = (
              parseFloat(user.balance) + parseFloat(req.body.amount)
            ).toString();
            User.updateOne(
              { unique_id: req.session.userId },
              { balance: currentAmount },
              function (err) {
                if (!err) {
                  res.redirect("dashboard");
                }
              }
            );
          }
        });
      } else {
        res.redirect("dashboard");
      }
};