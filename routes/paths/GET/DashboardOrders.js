//Modules

//Public Modules
var express = require("express");
require("dotenv").config();

//Database models
var Order = require("../../../models/order");

//Code

export default(req,res)=>{
    var orderId = req.params.orderId;
    if (req.session.userId) {
      Order.find({ orderId: orderId }, function (err, order) {
        console.log(order[0]);
        if (order.length > 0) {
          res.render("order", { order: order[0] });
        }
      });
    } else {
      res.redirect("/login");
    }
};