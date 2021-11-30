//Modules

//Local modules
const discountGenerator = require("../../../localModules/discountGenerator.js");

//Public Modules
var User = require("../../../models/user");
var Product = require("../../../models/product");
var Cart = require("../../../cart");
var Order = require("../../../models/order");

//Database models
var express = require("express");
require("dotenv").config();

//Code

export default(req,res)=>{
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1;
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
  
    var newdate = year + "/" + month + "/" + day;
    
  
    if (req.session.userId) {
      User.findOne(
        {
          unique_id: req.session.userId,
        },
        function (err, found) {
          if (found) {
            if (req.session.cart) {
              const cart = new Cart(req.session.cart).generateArray();
              cart.forEach(item=>{
                Product.findOneAndUpdate({productId:item.item.productId},{$inc :{downloadedCount:1}},(err)=>{
                  if(err){
                    console.log(err);
                  }
                });
              });
  
              const order = new Order({
                user: found,
                quantity: req.session.cart.totalQty,
                totalPrice: req.session.cart.totalPrice,
                date: newdate,
                code: discountGenerator.getDiscount().toString(),
              });
              for (var i = 0; i < cart.length; i++) {
                var product = {
                  product: cart[i].item,
                  type: cart[i].type,
                };
                console.log(product);
                order.products.push(product);
                found.products.push(product);
              }
              order.save();
              found.save();
              req.session.cart = null;
              req.session.save();
              res.redirect("/cart");
            }
          } else {
            res.redirect("/login");
          }
        }
      );
    }
};