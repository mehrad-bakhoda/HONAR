//Modules

//Public modules
var express = require("express");
require("dotenv").config();

//Code

export default(req,res)=>{
    if (
        req.body.adminUser == process.env.ADMIN_USER &&
        req.body.password == process.env.ADMIN_PASSWORD
      ) {
        req.session.userId = 0;
        console.log("admin logged in");
        res.redirect("/admin/home");
      }
};