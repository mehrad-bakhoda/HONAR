//Modules

//Public Modules
var express = require("express");
require("dotenv").config();

//Database models
var User = require("../../../models/user");

//Code

export default(req,res)=>{
    User.findOne({ unique_id: req.session.userId }, function (err, user) {
        if (user.balance && user.balance >= req.body.price) {
          const currentAmount = (
            parseFloat(user.balance) - parseFloat(req.body.price)
          ).toString();
          User.updateOne(
            { unique_id: req.session.userId },
            { balance: currentAmount },
            function (err) {
              if (!err) {
                res.redirect("home");
              }
            }
          );
        } else {
          res.redirect("home");
        }
      });
};