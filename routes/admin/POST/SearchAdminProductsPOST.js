//Modules

//Public modules
var express = require("express");
require("dotenv").config();

//Code

export default(req,res)=>{
    if (req.body.searchedItem == "" || req.body.searchedItem == " ") {
        res.redirect("/admin/products");
      } else {
        res.redirect("/search/admin/products/" + req.body.searchedItem);
      }
};