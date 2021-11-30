//Modules

//Public modules
var express = require("express");
require("dotenv").config();
//Code

export default(req,res)=>{
    if (req.session.userId == 0) {
        res.redirect("/admin/home");
      } else {
        res.render("adminLogin");
      }
};