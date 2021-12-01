//Modules

//Public Modules
import express from 'express';
require("dotenv").config();

//Database models
var Product = require("../../../models/product");
var Cart = require("../../../cart");

//Code
export default(req,res)=>{
    if (req.session.userId) {
        var productId = req.params.id;
        var type = req.params.type;
        var cart = new Cart(req.session.cart ? req.session.cart : {});
        let product = Product.findOne(
          {
            _id: productId,
          },
          function (err, product) {
            if (err) {
              console.log("item adding failed",err);
              res.render("notFound");
            }
            product.filePath.forEach((file) => {
              if (file.fileType === type) {
                cart.add(product, product.productId, type);
                req.session.cart = cart;
                req.session.save((err, savedCart) => {
                  if (err) console.log(err);
                  else {
                    res.redirect("/cart");
                  }
                });
              }
            });
          }
        );
      } else {
        res.redirect("/login");
      }
};