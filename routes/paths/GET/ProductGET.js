//Modules

//Public Modules
var express = require("express");
require("dotenv").config();

//Database models
var User = require("../../../models/user");
var Product = require("../../../models/product");

//Code

export default(req,res)=>{
    const link = req.params.itemID;
    Product.find({ $text: { $search: req.params.itemName } }).exec(function (
      err,
      searchedItem
    ) {
      Product.findOne(
        {
          productId: link,
        },
        function (err, found) {
          if (found && (found.confirmation || req.session.userId == 0)) {
            if (found.user.unique_id == req.session.userId) {
              res.render("productDetail", {
                item: found,
                searched: searchedItem,
                admin: "true",
                boughtTypes: ["None"],
              });
            } else {
              if (req.session.userId) {
                User.findOne(
                  {
                    unique_id: req.session.userId,
                    "products.product.productId": found.productId,
                  },
                  {},
                  function (err, found1) {
                    if (found1) {
                      var boughtTypes = [];
                      found1.products.forEach(function (product) {
                        boughtTypes.push(product.type);
                      });
                      console.log(boughtTypes);
                      res.render("productDetail", {
                        item: found,
                        searched: searchedItem,
                        admin: "false",
                        boughtTypes: boughtTypes,
                      });
                    } else {
                      res.render("productDetail", {
                        item: found,
                        searched: searchedItem,
                        admin: "false",
                        boughtTypes: ["None"],
                      });
                    }
                  }
                );
              } else {
                res.render("productDetail", {
                  item: found,
                  searched: searchedItem,
                  admin: "false",
                  boughtTypes: ["None"],
                });
              }
            }
          } else {
            res.render("notFound");
          }
        }
      );
    });
};