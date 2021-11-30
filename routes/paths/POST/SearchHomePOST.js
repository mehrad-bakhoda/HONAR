//Modules

//Public Modules
var express = require("express");
require("dotenv").config();

//Code

export default (req,res)=>{
    if (req.body.searchedItem == "" || req.body.searchedItem == " ") {
        res.redirect("/");
      } else {
        res.redirect("/search/home/" + req.body.searchedItem);
      }
};