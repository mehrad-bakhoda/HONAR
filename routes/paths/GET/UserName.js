//Modules

//Public Modules
var express = require("express");
require("dotenv").config();

//Database models
var User = require("../../../models/user");
var Product = require("../../../models/product");

//Code

export default (req,res)=>{
    if (req.params.userName.toLowerCase() != "logout") {
        User.findOne(
          {
            userName: req.params.userName.toLowerCase(),
          },
          function (err, found) {
            if (found) {
              Product.find({ "user.unique_id": found.unique_id }).exec(function (
                err,
                products
              ) {
                res.render("user", { user: found, searched: products });
              });
            } else {
              res.render("notFound");
            }
          }
        );
      }
};