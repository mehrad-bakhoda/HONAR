//Modules

//Local modules
const generateOTP = require("../../../localModules/generateOTP.js");

//Public Modules
var express = require("express");
require("dotenv").config();

//Database models
var User = require("../../../models/user");

//Code

export default(req,res)=>{
    var verifyCode = req.body.verifyCode1.concat(
        req.body.verifyCode2,
        req.body.verifyCode3,
        req.body.verifyCode4,
        req.body.verifyCode5,
        req.body.verifyCode6
      );
      if (req.body.loginInput.includes("@") === true) {
        User.findOne(
          {
            email: req.body.loginInput,
          },
          function (err, found) {
            if (!err) {
              if (found.verifyCode == verifyCode) {
                User.updateOne(
                  {
                    email: req.body.loginInput,
                  },
                  {
                    verified: true,
                  },
                  function (err, docs) {
                    if (err) {
                      console.log(err);
                    }
                  }
                );
                res.render("login", {
                  inputFouned: true,
                  inputVerify: true,
                  loginInput: req.body.loginInput,
                  newUser: true,
                });
              } else {
                User.updateMany(
                  {
                    email: req.body.loginInput,
                  },
                  {
                    verifyCode: generateOTP.createNewOTP(),
                    verified: false,
                  },
                  function (err, docs) {
                    if (err) {
                      console.log(err);
                    }
                  }
                );
                req.session.errors = [
                  {
                    value: verifyCode,
                    msg: "Wrong verifyCode",
                    param: "verifyCode",
                  },
                ];
                res.render("login", {
                  inputVerify: false,
                  inputFouned: false,
                  loginInput: req.body.loginInput,
                  newUser: false,
                });
                req.session.errors = null;
                req.session.save();
              }
            }
          }
        );
      } else {
        User.findOne(
          {
            phone: req.body.loginInput,
          },
          function (err, found) {
            if (!err) {
              if (found.verifyCode == verifyCode) {
                User.updateOne(
                  {
                    phone: req.body.loginInput,
                  },
                  {
                    verified: true,
                  },
                  function (err, docs) {
                    if (err) {
                      console.log(err);
                    }
                  }
                );
                res.render("login", {
                  inputFouned: true,
                  inputVerify: true,
                  loginInput: req.body.loginInput,
                  newUser: true,
                });
              } else {
                User.updateMany(
                  {
                    phone: req.body.loginInput,
                  },
                  {
                    verifyCode: generateOTP.createNewOTP(),
                    verified: false,
                  },
                  function (err, docs) {
                    if (err) {
                      console.log(err);
                    }
                  }
                );
                res.render("login", {
                  inputVerify: false,
                  inputFouned: false,
                  loginInput: req.body.loginInput,
                  newUser: false,
                });
              }
            }
          }
        );
      }

};