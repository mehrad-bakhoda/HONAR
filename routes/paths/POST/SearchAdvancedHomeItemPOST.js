//Modules

//Public Modules
var express = require("express");
require("dotenv").config();

//Code

export default (req,res)=>{
      //   Product.search(req.params.searchedItem, function(err, found) {
  //     res.render("search",{searched:found});
  //  });
  console.log(req.body);
  var fileTypes = "";
  var types = "";
  var dimensions = "";
  var price = "";
  var link = "";
  Object.entries(req.body).map((key) => {
    if (key[1] == "type") {
      types = types.concat("types[]=" + key[0] + "&");
    }
    if (key[1] == "fileType") {
      fileTypes = fileTypes.concat("fileTypes[]=" + key[0] + "&");
    }
    if (key[1] == "dimension") {
      dimensions = dimensions.concat("dimensions[]=" + key[0] + "&");
    }
    if (key[1] == "free" || key[1] == "non-free") {
      price = price.concat("price[]=" + key[0] + "&");
    }
  });
  link = link.concat(types);
  link = link.concat(fileTypes);
  link = link.concat(dimensions);
  link = link.concat(price);

  res.redirect(`/search/home/${req.params.searchedItem}?${link}`);
  // if (fileTypeArray.length == 0) {
  //   fileTypeArray = ["image/png", "image/jpeg", "video/mp4", "file/psd"];
  // }
  // if (types.length == 0) {
  //   fileTypeArray = ["clip", "graphic", "photo", "gif"];
  // }

  // Product.find(
  //   {
  //     confirmation: true,
  //     $and: [
  //       {
  //         $or: [
  //           { fileName: new RegExp(req.params.searchedItem, "gi") },
  //           { "user.userName": new RegExp(req.params.searchedItem, "gi") },
  //           { tags: new RegExp(req.params.searchedItem, "gi") },
  //           { "user.firstName": new RegExp(req.params.searchedItem, "gi") },
  //           { fileType: new RegExp(req.params.searchedItem, "gi") },
  //           { type: new RegExp(req.params.searchedItem, "gi") },
  //         ],
  //       },

  //       { filePath: { $elemMatch: { fileType: { $in: fileTypeArray } } } },

  //       { type: { $in: types } },
  //     ],
  //   },
  //   function (err, found) {
  //     if (found) {
  //       res.render("search", {
  //         searched: found,
  //         searchedItem: req.params.searchedItem,
  //         sortby: "مرتبط ترین",
  //         link: "/search/advanced/home/",
  //       });
  //     }
  //   }
  // );

};