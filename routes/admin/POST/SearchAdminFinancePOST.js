//Modules

//Public modules
var express = require("express");
require("dotenv").config();

//Code

export default(req,res)=>{
    if (req.body.searchedItem == "" || req.body.searchedItem == " ") {
        res.redirect("/admin/finance");
      } else {
        res.redirect("/search/admin/finance/" + req.body.searchedItem);
      }
};