//Modules

//Public Modules
var express = require("express");
require("dotenv").config();

//Database models
var Product = require("../../../models/product");

//Code

export default (req,res)=>{
      //   Product.search(req.params.searchedItem, function(err, found) {
  //     res.render("search",{searched:found});
  //  });
  var sort = {};
  var sortby = "مرتبط ترین";
  if (!Array.isArray(req.query.sortby)) {
    switch (req.query.sortby) {
      case "lowPrice":
        sort = { orginalPrice: "asc" };
        sortby = "ارزان ترین";
        break;
      case "highPrice":
        sort = { orginalPrice: "desc" };
        sortby = "گرانترین";
        break;
      case "mostView":
        sort = { downloadedCount: "desc" };
        sortby = "بیشترین بازدید";
        break;
      default:
        sort = {};
        sortby = "مرتبط ترین";
    }
  } else {
    switch (req.query.sortby[req.query.sortby.length - 1]) {
      case "lowPrice":
        sort = { orginalPrice: "asc" };
        sortby = "ارزان ترین";
        break;
      case "highPrice":
        sort = { orginalPrice: "desc" };
        sortby = "گرانترین";
        break;
      case "mostView":
        sort = { downloadedCount: "desc" };
        sortby = "بیشترین بازدید";
        break;
      default:
        sort = {};
        sortby = "مرتبط ترین";
    }
  }

  var typesFilter =
    req.query.types !== undefined
      ? { $in: req.query.types }
      : { $not: { $in: [] } };
  var fileTypesFilter =
    req.query.fileTypes !== undefined
      ? { $in: req.query.fileTypes }
      : { $not: { $in: [] } };
  Product.find({
    confirmation: true,
    $and: [
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
      { filePath: { $elemMatch: { fileType: fileTypesFilter } } },

      { type: typesFilter },
    ],
  })
    .sort(sort)
    .exec(function (err, found) {
      if (found) {
        res.render("search", {
          searched: found,
          searchedItem: req.params.searchedItem,
          sortby: sortby,
          link: req.url,
        });
      }
    });

};