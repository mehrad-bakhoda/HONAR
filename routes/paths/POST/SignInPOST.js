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
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      console.log(errors);
    }

    var dir = "public/covers/users/";
    const form = formidable({ multiples: true, uploadDir: dir });
    form.keepExtensions = true;
    form.maxFileSize = 100 * 1024 * 1024;
    form.parse(req, (err, fields, files) => {
      if (fields.loginInput.includes("@") === true) {
        User.findOne(
          {
            email: fields.loginInput,
          },
          async (err, found) => {
            if (!err) {
              if (found) {
                if (found.verified && found.hasPassword) {
                  const validPassword = await bcrypt.compare(
                    fields.password,
                    found.password
                  );
                  if (validPassword) {
                    req.session.userId = found.unique_id;
                    req.session.save();

                    res.redirect("/");
                  }
                  if (!validPassword) {
                    req.session.errors = [
                      {
                        value: fields.password,
                        msg: "Wrong Password",
                        param: "password",
                      },
                    ];
                    res.render("login", {
                      inputFouned: true,
                      inputVerify: true,
                      loginInput: fields.loginInput,
                      newUser: false,
                    });
                    req.session.errors = null;
                    req.session.save();
                  }
                }
              }
            }
          }
        );
      } else {
        User.findOne(
          {
            phone: fields.loginInput,
          },
          async (err, found) => {
            if (!err) {
              if (found) {
                if (found.verified && found.hasPassword) {
                  const validPassword = await bcrypt.compare(
                    fields.password,
                    found.password
                  );

                  if (validPassword) {
                    req.session.userId = found.unique_id;
                    req.session.save();

                    res.redirect("/");
                  }
                  if (!validPassword) {
                    req.session.errors = [
                      {
                        value: fields.password,
                        msg: "Wrong Password",
                        param: "password",
                      },
                    ];
                    res.render("login", {
                      inputFouned: true,
                      inputVerify: true,
                      loginInput: fields.loginInput,
                      newUser: false,
                    });
                    req.session.errors = null;
                    req.session.save();
                  }
                }
              }
            }
          }
        );
      }

      if (err) {
        next(err);
        return;
      }
    });
};