//Modules

//Local modules
const generateOTP = require("../../../localModules/generateOTP.js");
const smsPannel = require("../../../localModules/smsPannel.js");

//Public Modules
var express = require("express");
const { check, validationResult } = require("express-validator");
require("dotenv").config();

//Database models
var User = require("../../../models/user");

//Code

export default (req,res,next)=>{
    const errors = validationResult(req).array();
    if (errors.length != 0) {
      req.session.errors = errors;
      res.redirect("/login");
      return next();
    }

    console.log(
      "Phone Number " + '"' + req.body.loginInput + '"' + " received"
    );
    User.findOne(
      {
        phone: req.body.loginInput,
      },
      function (err, found) {
        if (!err) {
          if (found) {
            if (found.verified) {
              if (found.hasPassword) {
                console.log(
                  '"' +
                    req.body.loginInput +
                    '"' +
                    " is verified and has password"
                );

                res.render("login", {
                  inputFouned: true,
                  inputVerify: true,
                  loginInput: req.body.loginInput,
                  newUser: false,
                });
              }

              if (!found.hasPassword) {
                console.log(
                  '"' +
                    req.body.loginInput +
                    '"' +
                    " is verified but hasn't set the password"
                );

                generateOTP.newOtp(req.body.loginInput);

                res.render("login", {
                  inputFouned: false,
                  inputVerify: false,
                  loginInput: req.body.loginInput,
                  newUser: false,
                });
              }
            }
            if (!found.verified) {
              console.log('"' + req.body.loginInput + '"' + " is not verified");

              generateOTP.newOtp(req.body.loginInput);

              res.render("login", {
                inputFouned: false,
                inputVerify: false,
                loginInput: req.body.loginInput,
                newUser: false,
              });
            }
          }
          if (!found) {
            console.log(
              "---------------------- " +
                '"' +
                req.body.loginInput +
                '"' +
                " is a new User ----------------------"
            );
            var c;
            User.findOne({}, function (err, data) {
              if (data) {
                c = data.unique_id + 1;
              } else {
                c = 1;
              }
              let verification = generateOTP.createNewOTP();

              smsPannel.sendSMS(verification, req.body.loginInput);

              const user = new User({
                unique_id: c,
                phone: req.body.loginInput,
                verifyCode: verification,
                verified: "false",
                registered: "false",
                hasPassword: "false",
                date: new Date(),
              });
              console.log(user.verifyCode);
              user.save(function (err, docs) {
                if (!err) {
                  console.log("verify Code initiated!");
                } else {
                  console.log(err);
                }
              });
            })
              .sort({ _id: -1 })
              .limit(1);

            // setInterval(function() {
            //   User.updateOne({
            //     phone: req.body.loginInput
            //   }, {
            //     verifyCode: generateOTP.createNewOTP()
            //   }, function(err, docs) {
            //     if (!err) {
            //       console.log(docs + " updated successfuly");
            //     }
            //   });
            // }, 60000);
            console.log(
              "Created a user for " + '"' + req.body.loginInput + '"'
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
};