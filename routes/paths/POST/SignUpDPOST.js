//Modules

//Public Modules
var express = require("express");
const { check, validationResult } = require("express-validator");
const formidable = require("formidable");
require("dotenv").config();
const bcrypt = require("bcryptjs");

//Database models
var User = require("../../../models/user");

//Code

export default async(req,res)=>{
    const salt = await bcrypt.genSalt(10);
    const form = formidable({ multiples: true });
    form.keepExtensions = true;
    form.maxFileSize = 100 * 1024 * 1024;
    form.parse(req, (err, fields, files) => {
      console.log(check(fields.firstName).not().isEmpty());
  
      const errors = validationResult(req).array();
      if (errors.length != 0) {
        req.session.errors = errors;
        res.redirect("/login");
        return next();
      }
      console.log(files.profilePic);
      User.findOne(
        {
          phone: fields.loginInput,
        },
        async (err, found) => {
          if (!err) {
            if (found) {
              if (!found.hasPassword) {
                console.log("he's a Downloader");
  
                User.updateMany(
                  {
                    phone: fields.loginInput,
                  },
                  {
                    type: "Downloader",
                    firstName: fields.firstName,
                    lastName: fields.lastName,
                    profilePicPath:"no picture",
                    password: await bcrypt.hash(fields.password, salt),
                    hasPassword: true,
                  },
                  function (err, docs) {
                    if (!err) {
                      console.log(
                        '"' + fields.loginInput + '"' + " now has a password!"
                      );
                      req.session.userId = found.unique_id;
                      req.session.save();
                      console.log(
                        "Session created for" + '"' + fields.loginInput + '"'
                      );
                      console.log(
                        "Redirecting " +
                          '"' +
                          fields.loginInput +
                          '"' +
                          " to home!"
                      );
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