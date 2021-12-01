//Modules

//Public Modules
var express = require("express");
const fs = require("fs");
const formidable = require("formidable");
const path = require("path");
require("dotenv").config();
const bcrypt = require("bcryptjs");

//Database models
var User = require("../../../models/user");

//Code

export default async(req,res)=>{
    const salt = await bcrypt.genSalt(10);
    const dir = path.join(__dirname, "/../../../public/profilePic/users/");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true,
      });
    }
    const form = formidable({ multiples: true, uploadDir: dir });
    form.keepExtensions = true;
    form.maxFileSize = 100 * 1024 * 1024;
    form.parse(req, (err, fields, files) => {
      User.findOne(
        {
          phone: fields.loginInput,
        },
        async (err, found) => {
          if (!err) {
            if (found) {
              if (!found.hasPassword) {
                var profilePicPath = "";
                var fileName = path.basename(files.profilePic.path);
                var newPath = path.join("/profilePic/users/", fileName);
  
                if (files.profilePic.size != 0) profilePicPath = newPath;
                else profilePicPath = "no picture";
  
                User.updateMany(
                  {
                    phone: fields.loginInput,
                  },
                  {
                    type: "Uploader",
                    firstName: fields.firstName,
                    lastName: fields.lastName,
                    userName: fields.userName.toLowerCase(),
                    instagram: fields.instagram,
                    twitter: fields.twitter,
                    bio: fields.bio,
                    profilePicPath: profilePicPath,
                    password: await bcrypt.hash(fields.password, salt),
                    hasPassword: true,
                  },
                  function (err, docs) {
                    if (!err) {
                      req.session.userId = found.unique_id;
                      req.session.save();
                      res.redirect("/");
                    }
                  }
                );
              }
            }
          }
        }
      );
  
      if (err) {
        next(err);
        return;
      }
    });
};