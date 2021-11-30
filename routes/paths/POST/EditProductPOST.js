//Modules

//Local modules
const newDate = require("../../../localModules/date.js");

//Public Modules
var express = require("express");
const formidable = require("formidable");
require("dotenv").config();

//Database models
var User = require("../../../models/user");
var Product = require("../../../models/product");

//Code

export default async(req,res,next)=>{
    const form = formidable({ multiples: true });
    form.keepExtensions = true;
    form.maxFileSize = 100 * 1024 * 1024;
    form.parse(req, (err, fields, files) => {
      Product.findOne({ productId: req.params.productId }, function (err, found) {
        if (!err) {
          if (found) {
            if (found.tags && !fields.tags) {
              tagsarr = fields.tags.split(" ");
              for (var i = 0; i < tagsarr.length; i++) {
                if (
                  (tagsarr[i].includes("#") && tagsarr[i].length == 1) ||
                  !tagsarr[i].includes("#")
                ) {
                  delete tagsarr[i];
                }
              }
              tagsarr = tagsarr.filter(function (e) {
                return e;
              });
  
              Product.updateOne(
                {
                  productId: req.params.productId,
                },
                {
                  tags: fields.tags,
                },
                function (err) {
                  if (!err) {
                    console.log("sucess!");
                  }
                }
              );
            }
            if (fields.tags != found.tags && fields.tags) {
              tagsarr = fields.tags.split(" ");
              for (var i = 0; i < tagsarr.length; i++) {
                if (
                  (tagsarr[i].includes("#") && tagsarr[i].length == 1) ||
                  !tagsarr[i].includes("#")
                ) {
                  delete tagsarr[i];
                }
              }
              tagsarr = tagsarr.filter(function (e) {
                return e;
              });
  
              Product.updateOne(
                {
                  productId: req.params.productId,
                },
                {
                  tags: tagsarr,
                },
                function (err) {
                  if (!err) {
                    console.log("sucess!");
                  }
                }
              );
            }
  
            if (fields.fileName != found.fileName && fields.fileName) {
              Product.updateOne(
                {
                  productId: req.params.productId,
                },
                {
                  fileName: fields.fileName,
                },
                function (err) {
                  if (!err) {
                    console.log("sucess!");
                  }
                }
              );
            }
            if (found.description && !fields.description) {
              Product.updateOne(
                {
                  productId: req.params.productId,
                },
                {
                  description: fields.description,
                },
                function (err) {
                  if (!err) {
                    console.log("sucess!");
                  }
                }
              );
            }
  
            if (fields.description != found.description && fields.description) {
              Product.updateOne(
                {
                  productId: req.params.productId,
                },
                {
                  description: fields.description,
                },
                function (err) {
                  if (!err) {
                    console.log("sucess!");
                  }
                }
              );
            }
  
            if (
              fields.orginalPrice != found.orginalPrice &&
              fields.orginalPrice
            ) {
              Product.updateOne(
                {
                  productId: req.params.productId,
                },
                {
                  orginalPrice: fields.orginalPrice,
                },
                function (err) {
                  if (!err) {
                    console.log("sucess!");
                  }
                }
              );
            }
  
            if (fields.mediumPrice != found.mediumPrice && fields.mediumPrice) {
              Product.updateOne(
                {
                  productId: req.params.productId,
                },
                {
                  mediumPrice: fields.mediumPrice,
                },
                function (err) {
                  if (!err) {
                    console.log("sucess!");
                  }
                }
              );
            }
  
            if (fields.largePrice != found.largePrice && fields.largePrice) {
              Product.updateOne(
                {
                  productId: req.params.productId,
                },
                {
                  largePrice: fields.largePrice,
                },
                function (err) {
                  if (!err) {
                    console.log("sucess!");
                  }
                }
              );
            }
  
            if (fields.smallPrice != found.smallPrice && fields.smallPrice) {
              Product.updateOne(
                {
                  productId: req.params.productId,
                },
                {
                  smallPrice: fields.smallPrice,
                },
                function (err) {
                  if (!err) {
                    console.log("sucess!");
                  }
                }
              );
            }
  
            if (err) {
              next(err);
              let failedUpload = {
                message: `${fields.fileName} upload failed`,
                code: "222",
                date: newDate(new Date()),
              };
              Product.updateOne(
                {
                  unique_id: req.session.userId,
                },
                {
                  $push: { message: failedUpload },
                },
                function (err) {
                  if (!err) {
                    console.log("added status");
                  }
                }
              );
              return;
            }
            if (!err) {
              Product.findOne(
                { productId: req.params.productId },
                function (err, found) {
                  if (!err) {
                    let successfulUpload = {
                      message: `${found.fileName} changed`,
                      code: "111",
                      date: newDate(new Date()),
                    };
                    User.updateOne(
                      {
                        unique_id: req.session.userId,
                      },
                      {
                        $push: { message: successfulUpload },
                      },
                      function (err) {
                        if (!err) {
                          console.log("added status");
                        }
                      }
                    );
                  }
                }
              );
              res.redirect(`/Product/${found.productId}/${found.fileName}`);
            }
          }
        }
      });
    });

};