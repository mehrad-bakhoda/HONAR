//Modules

//Public Modules
var express = require("express");
require("dotenv").config();

//Database models
var User = require("../../../models/user");

//Code

export default (req,res)=>{
    if (req.session.userId) {
        User.findOne({ unique_id: req.session.userId }, function (err, user) {
          if(!err,user){
            res.render("orders",{orders:user.products});
          }
        });
      
      }else{
        res.redirect("/login");
      }
};