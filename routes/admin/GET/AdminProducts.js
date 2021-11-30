//Modules

//Public modules
var express = require("express");
require("dotenv").config();


//Database Models
var Product = require("../../../models/product");

//local modules
const newDate = require("../../../localModules/date.js");


//Code

export default(req,res)=>{
    if (req.session.userId == 0) {
        Product.find({ confirmation: false }, function (err, uProducts) {
          Product.find({ confirmation: true }, function (err, cProducts) {
            res.render("adminProducts", {
              unconfirmedProducts: uProducts,
              confirmedProducts: cProducts,
              date: newDate,
            });
          });
        });
      } else {
        res.redirect("/admin/login");
      }
};