//Modules

//Public modules
var express = require("express");
require("dotenv").config();


//Database Models
var Product = require("../../../models/product");


//Code

export default(req,res)=>{
    Product.updateOne(
        { productId: req.params.productId },
        { confirmation: true, date: new Date() },
        function (err) {
          if (!err) {
            res.redirect("/admin/products");
          }
        }
      );
};