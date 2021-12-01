//Modules

//Public Modules
var express = require("express");
require("dotenv").config();

//Database models
var Product = require("../../../models/product");

//Code

export default (req,res)=>{
    Object.entries(req.body).forEach(([key, value]) => {
        Product.find({})
          .where(value)
          .equals(key)
          .exec(function (err, data) {
            if (err) {
              console.log(err);
            }
          });
      });
};