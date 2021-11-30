//Modules

//Public modules
var express = require("express");
require("dotenv").config();

//Database Models
var User = require("../../../models/user");

//Code

export default(req,res)=>{
    User.deleteOne({ unique_id: req.params.unique_id }, function (err) {
        if (!err) {
          res.redirect("/admin/users");
        }
      });
};