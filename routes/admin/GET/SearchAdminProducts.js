//Modules

//Public modules
var express = require("express");
require("dotenv").config();

//Database Models
var Product = require("../../../models/product");

//local modules
const newDate = require("../../../localModules/date.js");

//Code

export default(req,res)=>{
      //   Product.search(req.params.searchedItem, function(err, found) {
  //     res.render("search",{searched:found});
  //  });
  if (req.session.userId == 0) {
    Product.find(
      {
        $or: [
          { fileName: new RegExp(req.params.searchedItem, "gi") },
          { "user.userName": new RegExp(req.params.searchedItem, "gi") },
          { tags: new RegExp(req.params.searchedItem, "gi") },
          { "user.firstName": new RegExp(req.params.searchedItem, "gi") },
          { fileType: new RegExp(req.params.searchedItem, "gi") },
          { type: new RegExp(req.params.searchedItem, "gi") },
        ],
      },
      function (err, found) {
        res.render("adminProductsSearch", { searched: found, date: newDate });
      }
    );
  } else {
    res.redirect("/admin/login");
  }
};