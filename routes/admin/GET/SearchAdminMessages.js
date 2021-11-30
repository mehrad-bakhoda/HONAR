//Modules

//Public modules
var express = require("express");
require("dotenv").config();


//Database Models
var Message = require("../../../models/message");

//local modules
const newDate = require("../../../localModules/date.js");


//Code

export default(req,res)=>{
      //   Product.search(req.params.searchedItem, function(err, found) {
  //     res.render("search",{searched:found});
  //  });
  if (req.session.userId == 0) {
    Message.find(
      {
        $or: [
          { message: new RegExp(req.params.searchedItem, "gi") },
          { title: new RegExp(req.params.searchedItem, "gi") },
          { response: new RegExp(req.params.searchedItem, "gi") },
          { "user.firstName": new RegExp(req.params.searchedItem, "gi") },
          { "user.lastName": new RegExp(req.params.searchedItem, "gi") },
          { "user.userName": new RegExp(req.params.searchedItem, "gi") },
        ],
      },
      function (err, found) {
        res.render("adminMessagesSearch", { searched: found, date: newDate });
      }
    );
  } else {
    res.redirect("/admin/login");
  }
};