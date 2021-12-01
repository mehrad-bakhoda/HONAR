//Modules

//Local modules
const generateOTP = require("../../../localModules/generateOTP.js");
const smsPannel = require("../../../localModules/smsPannel.js");

//Public Modules
var express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
require("dotenv").config();

//Database models
var User = require("../../../models/user");

//Code

export default async(req,res,next)=>{
  const salt = await bcrypt.genSalt(10);
    const errors = validationResult(req).array();
    if (errors.length != 0) {
      req.session.errors = errors;
      res.redirect("/login");
      return next();
    }

    User.findOne(
      {
        phone: req.body.loginInput,
      },
      async (err, found)=>{
        if (!err) {
          if (found) {
            if (found.verified) {
              if (found.hasPassword) {

                res.render("login", {
                  inputFouned: true,
                  inputVerify: true,
                  loginInput: req.body.loginInput,
                  newUser: false,
                });
              }

              if (!found.hasPassword) {

                let verification = generateOTP.createNewOTP();

                smsPannel.sendSMS(verification, req.body.loginInput);
                User.updateOne({phone: req.body.loginInput},{verifyCode:await bcrypt.hash(verification, salt)},async (err)=>{
                  if(err){
                    console.log(err);
                  }
                  if(!err){
                    res.render("login", {
                      inputFouned: false,
                      inputVerify: false,
                      loginInput: req.body.loginInput,
                      newUser: false,
                    });
                  }
                });


              }
            }
            if (!found.verified) {

              let verification = generateOTP.createNewOTP();

              smsPannel.sendSMS(verification, req.body.loginInput);
              User.updateOne({phone: req.body.loginInput},{verifyCode:await bcrypt.hash(verification, salt)},async(err)=>{
                if(err){
                  console.log(err);
                }
                if(!err){
                  res.render("login", {
                    inputFouned: false,
                    inputVerify: false,
                    loginInput: req.body.loginInput,
                    newUser: false,
                  });
                }
              });


            }
          }
          if (!found) {
            var c;
            User.findOne({}, async(err, data)=>{
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
                verifyCode: await bcrypt.hash(verification, salt),
                verified: "false",
                registered: "false",
                hasPassword: "false",
                date: new Date(),
              });
              user.save(function (err, docs) {
                if (err) {
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