//Modules

//Public modules
var express = require("express");
require("dotenv").config();

//Database Models
var User = require("../../../models/user");

//local modules
const newDate = require("../../../localModules/date.js");


//Code

export default(req,res)=>{
      //   Product.search(req.params.searchedItem, function(err, found) {
  //     res.render("search",{searched:found});
  //  });
  if (req.session.userId == 0) {
    User.find(
      {
        $or: [
          { userName: new RegExp(req.params.searchedItem, "gi") },
          { firstName: new RegExp(req.params.searchedItem, "gi") },
          { lastName: new RegExp(req.params.searchedItem, "gi") },
          { phone: new RegExp(req.params.searchedItem, "gi") },
          { email: new RegExp(req.params.searchedItem, "gi") },
        ],
      },
      function (err, found) {
        res.render("adminUsersSearch", { searched: found, date: newDate });
      }
    );
  } else {
    res.redirect("/admin/login");
  }
};