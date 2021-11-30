//Modules

//Public Modules
var express = require("express");
require("dotenv").config();

//Database models
var Cart = require("../../../cart");

//Code

export default(req,res)=>{
    if (req.session.userId) {
        var productId = req.params.id;
        var cart = new Cart(req.session.cart ? req.session.cart : {});
        cart.delete(productId);
        req.session.cart = cart;
        req.session.save();
        res.redirect("/cart");
      }
};