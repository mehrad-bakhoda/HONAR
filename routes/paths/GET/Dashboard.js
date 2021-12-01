//Modules

//Public Modules
var express = require("express");
require("dotenv").config();

//Database models
var User = require("../../../models/user");
var Product = require("../../../models/product");
var Message = require("../../../models/message");
var Discount = require("../../../models/discount");
var Order = require("../../../models/order");
const newDate = require("../../../localModules/date.js");

//Code

export default(req,res)=>{
    if (req.session.userId) {
        User.findOne(
          {
            unique_id: req.session.userId,
          },
          function (err, found) {
            if(err){
              console.log(err);
              res.redirect("/dashboard");
            }
            if (found) {
              Product.find({ "user.unique_id": found.unique_id }).exec(function (
                err,
                products
              ) {
                if(err){
                  console.log(err);
                  res.redirect("/dashboard");
                }
                Order.find(
                  { "user.unique_id": req.session.userId },
                  function (err, orders) {
                    if(err){
                      console.log(err);
                      res.redirect("/dashboard");
                    }
                    Discount.find(
                      { userId: req.session.userId },
                      function (err, discounts) {
                        if (!err) {
                          if (discounts) {
                            Message.find(
                              { "user.unique_id": req.session.userId },
                              function (err, messages) {
                                if (!err) {
                                  res.render("dashboard", {
                                    user: found,
                                    searched: products,
                                    statusMessage: found.message,
                                    date: newDate(new Date()),
                                    orders: orders,
                                    discounts: discounts,
                                    messages: messages,
                                    error1: null,
                                  });
                                }
                              }
                            );
                          }
                        }
                        if(err){
                          console.log(err);
                          res.redirect("/dashboard");
                        }
                      }
                    );
                  }
                );
              });
            } else {
              res.render("notFound");
            }
          }
        );
      }else{
        res.redirect("/login");
      }
};