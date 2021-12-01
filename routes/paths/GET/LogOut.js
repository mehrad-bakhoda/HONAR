//Modules

//Public Modules
var express = require("express");
require("dotenv").config();

//Code

export default(req,res)=>{
    if (req.session.userId) {
        // delete session object
        req.session.destroy(function (err) {
          if (err) {
            return next(err);
          } else {
            return res.redirect("/");
          }
        });
      }else{
        res.redirect("/");
      }
};