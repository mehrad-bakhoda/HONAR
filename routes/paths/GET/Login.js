//Modules

//Public Modules
var express = require("express");
require("dotenv").config();

//Code

export default(req,res)=>{
    if (req.session.userId) {
        res.redirect("/dashboard");
      } else {
        res.render("login", {
          inputFouned: false,
          inputVerify: true,
          loginInput: req.body.loginInput,
          newUser: false,
          back: true,
        });
      }
};