//Modules

//Public modules
var express = require("express");
require("dotenv").config();


//Database Models
var Product = require("../../../models/product");

//Code

export default(req,res)=>{
    Product.deleteOne({ productId: req.params.productId }, function (err) {
        if (!err) {
          res.redirect("/admin/products");
        }
      });
};