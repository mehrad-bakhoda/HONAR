//Modules

//Public Modules
var express = require("express");
require("dotenv").config();

//Database models
var Product = require("../../../models/product");

//Code

export default(req,res)=>{
    if (req.session.userId == req.params.uniqueId) {
        Product.find({ $text: { $search: req.params.itemName } })
          // .skip(20)
          // .limit(10)
          .exec(function (err, searchedItem) {
            Product.findOne(
              {
                productId: req.params.itemID,
              },
              function (err, found) {
                if (found) {
                  res.render("editProduct", { product: found });
                } else {
                  res.render("notFound");
                }
              }
            );
          });
      } else {
        res.render("notFound");
      }
};