//Modules

//Public modules
var express = require("express");
require("dotenv").config();


//Database Models
var Order = require("../../../models/order");

//local modules
const newDate = require("../../../localModules/date.js");


//Code

export default(req,res)=>{
    if (req.session.userId == 0) {
        Order.find({}, function (err, orders) {
          res.render("adminFinance", { orders: orders, date: newDate });
        });
      } else {
        res.redirect("/admin/login");
      }
};