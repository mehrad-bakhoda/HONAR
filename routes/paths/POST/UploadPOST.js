//Modules

//Local modules
const newDate = require("../../../localModules/date.js");

//Public Modules
var express = require("express");
const sharp = require("sharp");
const fs = require("fs");
const formidable = require("formidable");
const path = require("path");
require("dotenv").config();

//Database models
var User = require("../../../models/user");
var Product = require("../../../models/product");

//Code

export default async(req,res)=>{
    var c;
    User.findOne({ unique_id: req.session.userId }, function (err, found) {
      if (!err)
        if (found) {
          Product.findOne({}, {}, { sort: { _id: -1 } }, function (err, data) {
            if (data) {
              c = data.productId + 1;
            } else {
              c = 1;
            }
            const dir =
              __dirname +
              "/../../../uploads/users/" +
              found.unique_id +
              "/Products/" +
              c;
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, {
                recursive: true,
              });
            }
            const editedImageDir =
              __dirname +
              "/../../../public/covers/users/" +
              found.unique_id +
              "/Products/" +
              c;
            if (!fs.existsSync(editedImageDir)) {
              fs.mkdirSync(editedImageDir, {
                recursive: true,
              });
            }
  
            //         let imgActive = 'active/image.jpg';
            //
            //         Jimp.read('raw/originalimage.png')
            //   .then((tpl) => tpl.clone().write(imgActive))
            //   .then(() => Jimp.read(imgActive))
            //   .then((tpl) =>
            //       Jimp.read('raw/logo.png').then((logoTpl) => {
            //           logoTpl.opacity(0.2)
            //           return tpl.composite(logoTpl, 512, 512, [Jimp.BLEND_DESTINATION_OVER])
            //       }),
            //   )
            //   .then((tpl) => tpl.write('raw/watermark.png'))
            // }
  
            const form = formidable({ multiples: true, uploadDir: dir });
            form.keepExtensions = true;
            form.maxFileSize = 100 * 1024 * 1024;
            form.parse(req, (err, fields, files) => {
              const fileName = path.basename(files.productCover.path);
              const databaseDestination =
                "covers/users/" +
                found.unique_id +
                "/Products/" +
                c +
                "/" +
                fileName;
              const destination =
                "public/covers/users/" +
                found.unique_id +
                "/Products/" +
                c +
                "/" +
                fileName;
  
              const width = 750;
              const height = 483;
              const text = "Axgraphy";
  
              const svgImage = `
                <svg width="${width}" height="${height}">
                  <style>
                  .title { fill: #001; font-size: 70px; font-weight: bold;}
                  </style>
                  <text x="50%" y="50%" text-anchor="middle" class="title" style="color:red;">${text}</text>
                </svg>
                `;
              const svgBuffer = Buffer.from(svgImage);
              sharp(files.productCover.path)
                .composite([
                  {
                    input: svgBuffer,
                    bottom: 0,
                    right: 0,
                  },
                ])
                .webp({
                  lossless: true,
                  quality: 60,
                  alphaQuality: 80,
                  force: false,
                })
                .toFile(`${destination.split(".")[0]}.webp`)
                .then((info) => {
                  console.log(info);
                })
                .catch((err) => {
                  console.log(err);
                });
  
              // Jimp.read(files.productCover.path)
              //   .then((image) => {
              //     image.gaussian(1);
              //     image.quality(50);
              //     Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then((font) => {
              //       image.print(font, 0, 0, "@ART APP");
              //     });
              //     image.write(destination);
              //   })
              //   .catch((err) => {
              //     console.log(err);
              //   });
  
              let tagsarr = fields.tags.split(" ");
              for (var i = 0; i < tagsarr.length; i++) {
                if (
                  (tagsarr[i].includes("#") && tagsarr[i].length == 1) ||
                  !tagsarr[i].includes("#")
                ) {
                  delete tagsarr[i];
                }
              }
              var fileTypes = fields.fileTypes;
              // fileTypes.pop();
  
              tagsarr = tagsarr.filter(function (e) {
                return e;
              });
              var filepath = [];
              try {
                files.productFiles.map((file) => {
                  var fileType = file.type.split("/")[1];
                  if (fileType === "octet-stream") fileType = "psd";
                  var item = {
                    filePath: file.path,
                    fileType: fileType,
                  };
  
                  filepath.push(item);
                });
              } catch (error) {
                var item = {
                  filePath: files.productFiles.path,
                  fileType: files.productFiles.type,
                };
                filepath.push(item);
              }
  
              const newProduct = new Product({
                productId: c,
                type: fields.types,
                fileName: fields.fileName,
                tags: tagsarr,
                description: fields.description,
                filePath: filepath,
                fileType: files.productFiles.type,
                fileTypes: fileTypes,
                coverPath: databaseDestination.split(".")[0] + ".webp",
                orginalPrice: fields.orginalPrice,
                largePrice: fields.largePrice,
                mediumPrice: fields.mediumPrice,
                smallPrice: fields.smallPrice,
                user: found,
                date: new Date(),
                confirmation: false,
              });
  
              newProduct.save();
  
              // found.products.push(newProduct);
              found.save();
  
              if (err) {
                next(err);
  
                let failedUpload = {
                  message: `${fields.fileName} upload failed`,
                  code: "222",
                  date: newDate(new Date()),
                };
                User.updateOne(
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
                let successfulUpload = {
                  message: `${fields.fileName} upload was succesfull`,
                  code: "000",
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
              res.redirect("/");
            });
          });
        }
    });
};