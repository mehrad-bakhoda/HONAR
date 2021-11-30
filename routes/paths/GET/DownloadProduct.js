//Modules

//Public Modules
var express = require("express");
require("dotenv").config();

//Database models
var User = require("../../../models/user");
var Product = require("../../../models/product");

//Code

export default (req,res)=>{
    if (req.session.userId) {
        var type = req.params.type;
        var productId = req.params.productId;
        Product.findOneAndUpdate({_id:productId},{$inc :{downloadedCount:1}},(err)=>{
          if(err){
            console.log(err);
          }
        });
        Product.findOne({ _id: productId }, function (err, product) {
          if (product.orginalPrice === 0) {
            for (var i = 0; i < product.filePath.length; i++) {
              if (product.filePath[i].fileType === type) {
                res.download(product.filePath[i].filePath, function (err) {
                  if (err) console.log(`Error: ${err}`);
                });
              }
            }
          } else {
            User.findOne(
              {
                unique_id: req.session.userId,
                "products.product._id": productId,
                "products.type": type,
              },
              {},
              function (err, found) {
                if (found) {
                  for (var i = 0; i < product.filePath.length; i++) {
                    if (product.filePath[i].fileType === type) {
                      res.download(product.filePath[i].filePath, function (err) {
                        if (err) console.log(`Error: ${err}`);
                      });
                    }
                  }
                } else res.render("notFound");
              }
            );
          }
          // if (size == "original" && product.orginalPrice == 0) {
          //   res.download(product.filePath, function (error) {
          //     if (error) {
          //       console.log("Error : ", error);
          //     }
          //   });
          // } else if (size == "large" && product.largePrice == 0) {
          //   res.download(product.filePath, function (error) {
          //     if (error) {
          //       console.log("Error : ", error);
          //     }
          //   });
          // } else if (size == "medium" && product.mediumPrice == 0) {
          //   res.download(product.filePath, function (error) {
          //     if (error) {
          //       console.log("Error : ", error);
          //     }
          //   });
          // } else if (size == "small" && product.smallPrice == 0) {
          //   res.download(product.filePath, function (error) {
          //     if (error) {
          //       console.log("Error : ", error);
          //     }
          //   });
          // } else {
          //   User.findOne(
          //     { unique_id: req.session.userId },
          //     {
          //       products: {
          //         $elemMatch: {
          //           "product._id": req.params.productId,
          //           size: req.params.size,
          //         },
          //       },
          //     },
          //     function (err, found) {
          //       if (!err) {
          //         res.download(
          //           found.products[0].product.filePath,
          //           function (error) {
          //             if (error) {
          //               console.log("Error : ", error);
          //             }
          //           }
          //         );
    
          //         // if(!found.downloaded.length){
          //         //   let download={product:req.params.productId,size:req.params.size};
          //         //   User.updateOne({
          //         //     unique_id:req.session.userId
          //         //   },
          //         //   {
          //         //     $push:{downloaded:download}
          //         //   },function(err){
          //         //     if(!err){
          //         //       console.log("success");
          //         //     }else{
          //         //       console.log(err);
          //         //     }
          //         //   });
    
          //         // }
          //       }
          //     }
          //   );
          // }
        });
      } else {
        res.redirect("/login");
      }
};