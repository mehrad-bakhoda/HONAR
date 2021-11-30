//Modules

//Public Modules
var express = require("express");
require("dotenv").config();

//Database models
var Product = require("../../../models/product");

//Code

export default (req,res)=>{
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
    tagss = "#" + req.params.tag;
  
    Product.find({ tags: { $in: tagss } })
      .sort(sort)
      .exec(function (err, found) {
        res.render("search", {
          searched: found,
          searchedItem: req.params.tag,
          sortby: sortby,
          link: req.url,
        });
      });
};