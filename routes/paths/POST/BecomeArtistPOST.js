//Modules

import { errorMonitor } from "events";

//Local modules
const newDate = require("../../../localModules/date.js");

//Public Modules
var express = require("express");
const path = require("path");
const fs = require("fs");
const formidable = require("formidable");

//Database models
var User = require("../../../models/user");
var Product = require("../../../models/product");

//Code

export default (req,res,next)=>{

    const dir = path.join(__dirname, "../../../public/profilePic/users/");
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
          unique_id: req.session.userId,
        },
        function (err, found) {
          if (!err) {
            if (found) {
              User.updateMany(
                { unique_id: found.unique_id },
                { type: "Uploader" },
                function (err) {
                  if (err) {
                    console.log(err);
                  }
                }
              );
              if (
                files.profilePic != found.profilePic &&
                files.profilePic &&
                files.profilePic.size != 0
              ) {
                var profilePicPath = "";
                var fileName = path.basename(files.profilePic.path);
                var newPath = path.join("/profilePic/users/", fileName);
  
                if (files.profilePic.size != 0) profilePicPath = newPath;
                else profilePicPath = "no picture";
  
                const removeDir = path.join(__dirname,"../../../public",found.profilePicPath);
                fs.unlink(removeDir, (err) => {
                  if (err) {
                    console.error(err);
                    return;
                  }
  
                  console.log(err);
                });
  
                User.updateOne(
                  {
                    unique_id: req.session.userId,
                  },
                  {
                    profilePicPath: profilePicPath,
                  },
                  function (err) {
                    if (!err) {
                      let successfulProfilePicChange = {
                        message: `Profile picture updated`,
                        code: "111",
                        date: newDate(new Date()),
                      };
                      User.updateOne(
                        {
                          unique_id: req.session.userId,
                        },
                        {
                          $push: { message: successfulProfilePicChange },
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
                Product.updateMany(
                  { "user.unique_id": found.unique_id },
                  { "user.prodilePicPath": fields.profilePicPath },
                  function (err) {
                    if (err) {
                      console.log(err);
                    }
                  }
                );
              }
  
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
                Product.updateMany(
                  { "user.unique_id": found.unique_id },
                  { "user.firstName": fields.firstName },
                  function (err) {
                    if (err) {
                      console.log(err);
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
                        message: `LastName changed to ${fields.lastName}`,
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
                Product.updateMany(
                  { "user.unique_id": found.unique_id },
                  { "user.lastName": fields.lastName },
                  function (err) {
                    if (err) {
                      console.log(err);
                    }
                  }
                );
              }
              if (fields.userName != found.userName && fields.userName) {
                User.findOne(
                  { userName: fields.userName.toLowerCase() },
                  function (err, userNameFound) {
                    if (!err) {
                      if (userNameFound) {
                        if (userNameFound.unique_id != req.session.userId) {
                          let unsuccessfullUserNameChange = {
                            message: `couldnt change username | ${fields.userName.toLowerCase()} already exists`,
                            code: "222",
                            date: newDate(new Date()),
                          };
                          User.updateOne(
                            {
                              unique_id: req.session.userId,
                            },
                            {
                              $push: { message: unsuccessfullUserNameChange },
                            },
                            function (err) {
                              if (err) {
                                console.log(err);
                              }
                            }
                          );
                        }
                      } else {
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
                                message: `UserName changed to ${fields.userName}`,
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
                    }
                  }
                );
                Product.updateMany(
                  { "user.unique_id": found.unique_id },
                  { "user.userName": fields.userName.toLowerCase() },
                  function (err) {
                    if (err) {
                      console.log(err);
                    }
                  }
                );
              }
              if (found.instagram && !fields.instagram) {
                User.updateOne(
                  {
                    unique_id: req.session.userId,
                  },
                  {
                    instagram: fields.instagram,
                  },
                  function (err) {
                    if (!err) {
                      let successfulInstagramchange = {
                        message: `instagram link removed`,
                        code: "111",
                        date: newDate(new Date()),
                      };
                      User.updateOne(
                        {
                          unique_id: req.session.userId,
                        },
                        {
                          $push: { message: successfulInstagramchange },
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
              if (fields.instagram != found.instagram && fields.instagram) {
                User.updateOne(
                  {
                    unique_id: req.session.userId,
                  },
                  {
                    instagram: fields.instagram,
                  },
                  function (err) {
                    if (!err) {
                      let successfullInstagramChange = {
                        message: `Instagram link updated`,
                        code: "111",
                        date: newDate(new Date()),
                      };
                      User.updateOne(
                        {
                          unique_id: req.session.userId,
                        },
                        {
                          $push: { message: successfullInstagramChange },
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
                Product.updateMany(
                  { "user.unique_id": found.unique_id },
                  { "user.instagram": fields.instagram },
                  function (err) {
                    if (err) {
                      console.log(err);
                    }
                  }
                );
              }
              if (found.twitter && !fields.twitter) {
                User.updateOne(
                  {
                    unique_id: req.session.userId,
                  },
                  {
                    twitter: fields.twitter,
                  },
                  function (err) {
                    if (!err) {
                      let successfulTwitterchange = {
                        message: `twitter link removed`,
                        code: "111",
                        date: newDate(new Date()),
                      };
                      User.updateOne(
                        {
                          unique_id: req.session.userId,
                        },
                        {
                          $push: { message: successfulTwitterchange },
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
              if (fields.twitter != found.twitter && fields.twitter) {
                User.updateOne(
                  {
                    unique_id: req.session.userId,
                  },
                  {
                    twitter: fields.twitter,
                  },
                  function (err) {
                    if (!err) {
                      let successfullTwitterChange = {
                        message: `Twitter link updated`,
                        code: "111",
                        date: newDate(new Date()),
                      };
                      User.updateOne(
                        {
                          unique_id: req.session.userId,
                        },
                        {
                          $push: { message: successfullTwitterChange },
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
                Product.updateMany(
                  { "user.unique_id": found.unique_id },
                  { "user.twitter": fields.twitter },
                  function (err) {
                    if (err) {
                      console.log(err);
                    }
                  }
                );
              }
              if (found.bio && !fields.bio) {
                User.updateOne(
                  {
                    unique_id: req.session.userId,
                  },
                  {
                    bio: fields.bio,
                  },
                  function (err) {
                    if (!err) {
                      let successfulBioChange = {
                        message: `bio removed`,
                        code: "111",
                        date: newDate(new Date()),
                      };
                      User.updateOne(
                        {
                          unique_id: req.session.userId,
                        },
                        {
                          $push: { message: successfulBioChange },
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
  
              if (fields.bio != found.bio && fields.bio) {
                User.updateOne(
                  {
                    unique_id: req.session.userId,
                  },
                  {
                    bio: fields.bio,
                  },
                  function (err) {
                    if (!err) {
                      let successfullBioChange = {
                        message: `bio updated`,
                        code: "111",
                        date: newDate(new Date()),
                      };
                      User.updateOne(
                        {
                          unique_id: req.session.userId,
                        },
                        {
                          $push: { message: successfullBioChange },
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
                Product.updateMany(
                  { "user.unique_id": found.unique_id },
                  { "user.bio": fields.bio },
                  function (err) {
                    if (err) {
                      console.log(err);
                    }
                  }
                );
              }
  
              if (found.email && !fields.email) {
                User.updateOne(
                  {
                    unique_id: req.session.userId,
                  },
                  {
                    email: fields.email,
                  },
                  function (err) {
                    if (!err) {
                      let successfulEmailchange = {
                        message: `email removed`,
                        code: "111",
                        date: newDate(new Date()),
                      };
                      User.updateOne(
                        {
                          unique_id: req.session.userId,
                        },
                        {
                          $push: { message: successfulEmailchange },
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
              if (fields.email != found.email && fields.email) {
                User.updateOne(
                  {
                    unique_id: req.session.userId,
                  },
                  {
                    email: fields.email,
                  },
                  function (err) {
                    if (!err) {
                      let successfullEmailChange = {
                        message: `Email updated`,
                        code: "111",
                        date: newDate(new Date()),
                      };
                      User.updateOne(
                        {
                          unique_id: req.session.userId,
                        },
                        {
                          $push: { message: successfullEmailChange },
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
                Product.updateMany(
                  { "user.unique_id": found.unique_id },
                  { "user.email": fields.email },
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
        }, 300);
      }
    });
};