//Modules

//Public Modules
var express = require("express");
require("dotenv").config();

//Database models
var User = require("../../../models/user");
var Product = require("../../../models/product");

//Code

export default (req,res)=>{
    Product.find({ confirmation: true })
    .limit(10)
    .sort({ downloadedCount: "desc" })
    .exec(function (err, bestSales) {
      Product.find({ confirmation: true })
        .sort({ rating: "desc" })
        .exec(function (err, bestOfAll) {
          Product.find({ confirmation: true })
            .sort({ date: "desc" })
            .exec(function (err, latest) {
              if (req.session.userId) {
                User.findOne(
                  {
                    unique_id: req.session.userId,
                  },
                  function (err, found) {
                    if (!err) {
                      if (found) {
                        res.render("home", {
                          loggedIn: true,
                          bestOfAll: bestOfAll,
                          bestSales: bestSales,
                          latest: latest,
                        });
                      }
                    }
                  }
                );
              } else {
                res.render("home", {
                  loggedIn: false,
                  bestOfAll: bestOfAll,
                  bestSales: bestSales,
                  latest: latest,
                });
              }
            });
        });
    });
};