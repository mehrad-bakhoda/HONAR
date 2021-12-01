//Modules

//Local modules
const newDate = require("../../../localModules/date.js");

//Public Modules
var express = require("express");
const formidable = require("formidable");
const path = require("path");
require("dotenv").config();
const fs = require("fs");
const bcrypt = require("bcryptjs");

//Database models
var User = require("../../../models/user");

//Code

export default async(req,res,next)=>{
    const dir = path.join(__dirname, "/../../../public/profilePic/users/");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true,
      });
    }
  
    const form = formidable({ multiples: true, uploadDir: dir });
    form.keepExtensions = true;
    form.maxFileSize =100 * 1024 * 1024;
    form.parse(req, (err, fields, files) => {
      User.findOne(
        {
          unique_id: req.session.userId,
        },
        async (err, found) => {
          if (!err) {
            if (found) {
              const validPassword = await bcrypt.compare(
                fields.oldPassword,
                found.password
              );
              if (fields && validPassword) {
                if (fields.firstName != found.firstName && fields.firstName) {
                  User.updateOne(
                    {
                      unique_id: req.session.userId,
                    },
                    {
                      firstName: fields.firstName,
                    },
                    function (err) {
                      if (!err) {
                        let successfulNamechange = {
                          message: `FirstName changed from ${found.firstName} to ${fields.firstName}`,
                          code: "111",
                          date: newDate(new Date()),
                        };
                        User.updateOne(
                          {
                            unique_id: req.session.userId,
                          },
                          {
                            $push: { message: successfulNamechange },
                          },
                          function (err) {
                            if (err) {
                              console.log(err);
                            }
                          }
                        );
                      }
                    }
                  );
                }
                if (fields.lastName != found.lastName && fields.lastName) {
                  User.updateOne(
                    {
                      unique_id: req.session.userId,
                    },
                    {
                      lastName: fields.lastName,
                    },
                    function (err) {
                      if (!err) {
                        let successfullLastNameChange = {
                          message: `LastName changed from ${found.lastName} to ${fields.lastName}`,
                          code: "111",
                          date: newDate(new Date()),
                        };
                        User.updateOne(
                          {
                            unique_id: req.session.userId,
                          },
                          {
                            $push: { message: successfullLastNameChange },
                          },
                          function (err) {
                            if (err) {
                              console.log(err);
                            }
                          }
                        );
  
                      }
                    }
                  );
                }
                if (fields.userName != found.userName && fields.userName) {
                  User.updateOne(
                    {
                      unique_id: req.session.userId,
                    },
                    {
                      userName: fields.userName.toLowerCase(),
                    },
                    function (err) {
                      if (!err) {
                        let successfullUserNameChange = {
                          message: `UserName changed from ${found.userName} to ${fields.userName}`,
                          code: "111",
                          date: newDate(new Date()),
                        };
                        User.updateOne(
                          {
                            unique_id: req.session.userId,
                          },
                          {
                            $push: { message: successfullUserNameChange },
                          },
                          function (err) {
                            if (err) {
                              console.log(err);
                            }
                          }
                        );
  
                      }
                    }
                  );
                }
                const validPassword = await bcrypt.compare(
                  fields.password,
                  found.password
                );
                if (
                  fields.password &&
                  fields.passwordConfirmation &&
                  fields.password === fields.passwordConfirmation &&
                  !validPassword
                ) {
                  User.updateOne(
                    {
                      unique_id: req.session.userId,
                    },
                    {
                      password: await bcrypt.hash(fields.password, salt),
                    },
                    function (err) {
                      if (!err) {
                        let successfullPasswordChange = {
                          message: `password changed`,
                          code: "111",
                          date: newDate(new Date()),
                        };
                        User.updateOne(
                          {
                            unique_id: req.session.userId,
                          },
                          {
                            $push: { message: successfullPasswordChange },
                          },
                          function (err) {
                            if (err) {
                              console.log(err);
                            }
                          }
                        );
                      }
                    }
                  );
                }
              } else {
                let wrongPassword = {
                  message: `wrong password`,
                  code: "222",
                  date: newDate(new Date()),
                };
                User.updateOne(
                  {
                    unique_id: req.session.userId,
                  },
                  {
                    $push: { message: wrongPassword },
                  },
                  function (err) {
                    if (err) {
                      console.log(err);
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
      if (!err) {
        setTimeout(function () {
          res.redirect("/dashboard");
        }, 200);
      }
    });
};