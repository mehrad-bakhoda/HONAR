var express = require("express");
var router = express.Router();
var User = require("../models/user");
var CreditCard = require("../models/creditCard");
var Product = require("../models/product");
var Message = require("../models/message");
var Discount = require("../models/discount");
var Cart = require("../cart");
var Order = require("../models/order");
// const Jimp = require("jimp");
const sharp = require("sharp");

// const bodyParser=require("body-parser");
const { check, validationResult } = require("express-validator");

const fs = require("fs");
const generateOTP = require("../localModules/generateOTP.js");
const discountGenerator = require("../localModules/discountGenerator.js");
const smsPannel = require("../localModules/smsPannel.js");
const newDate = require("../localModules/date.js");
const formidable = require("formidable");
// const urlencodedParser =bodyParser.urlencoded({extended:false});
const path = require("path");
const user = require("../models/user");
const product = require("../models/product");
const date = require("../localModules/date.js");
const { type } = require("os");
require("dotenv").config();
const bcrypt = require("bcryptjs");

// GET ROUTE'S
router.get("/become-artist", function (req, res) {
  if (req.session.userId) {
    User.findOne({ unique_id: req.session.userId }, function (err, found) {
      if (!err) {
        if (found) {
          res.render("becomeArtist", { user: found });
        }
      }
    });
  }
});
router.post("/becomeArtist", async (req, res, next) => {
  const dir = path.join(__dirname, "/../public/profilePic/users/");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
      recursive: true,
    });
  }

  const form = formidable({ multiples: true, uploadDir: dir });
  form.keepExtensions = true;
  form.maxFileSize = 10 * 1024 * 1024;
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
                if (!err) {
                  console.log("user Type updated");
                }
              }
            );
            if (
              files.profilePic != found.profilePic &&
              files.profilePic &&
              files.profilePic.size != 0
            ) {
              console.log("true");
              var profilePicPath = "";
              var fileName = path.basename(files.profilePic.path);
              var newPath = path.join("/profilePic/users/", fileName);

              if (files.profilePic.size != 0) profilePicPath = newPath;
              else profilePicPath = "no picture";

              const removeDir = path.join(
                __dirname,
                "/../public",
                found.profilePicPath
              );
              fs.unlink(removeDir, (err) => {
                if (err) {
                  console.error(err);
                  return;
                }

                console.log("file removed");
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
                        if (!err) {
                          console.log("added status");
                        }
                      }
                    );

                    console.log("sucess!");
                  }
                }
              );
              Product.updateMany(
                { "user.unique_id": found.unique_id },
                { "user.prodilePicPath": fields.profilePicPath },
                function (err) {
                  if (!err) {
                    console.log("products user updated");
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
                        if (!err) {
                          console.log("added status");
                        }
                      }
                    );
                    console.log("sucess!");
                  }
                }
              );
              Product.updateMany(
                { "user.unique_id": found.unique_id },
                { "user.firstName": fields.firstName },
                function (err) {
                  if (!err) {
                    console.log("products user updated");
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
                        if (!err) {
                          console.log("added status");
                        }
                      }
                    );

                    console.log("sucess!");
                  }
                }
              );
              Product.updateMany(
                { "user.unique_id": found.unique_id },
                { "user.lastName": fields.lastName },
                function (err) {
                  if (!err) {
                    console.log("products user updated");
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
                            if (!err) {
                              console.log("added status");
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
                                if (!err) {
                                  console.log("added status");
                                }
                              }
                            );

                            console.log("sucess!");
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
                  if (!err) {
                    console.log("products user updated");
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
                        if (!err) {
                          console.log("added status");
                        }
                      }
                    );
                    console.log("sucess!");
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
                        if (!err) {
                          console.log("added status");
                        }
                      }
                    );
                    console.log("sucess!");
                  }
                }
              );
              Product.updateMany(
                { "user.unique_id": found.unique_id },
                { "user.instagram": fields.instagram },
                function (err) {
                  if (!err) {
                    console.log("products user updated");
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
                        if (!err) {
                          console.log("added status");
                        }
                      }
                    );
                    console.log("sucess!");
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
                        if (!err) {
                          console.log("added status");
                        }
                      }
                    );
                    console.log("sucess!");
                  }
                }
              );
              Product.updateMany(
                { "user.unique_id": found.unique_id },
                { "user.twitter": fields.twitter },
                function (err) {
                  if (!err) {
                    console.log("products user updated");
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
                        if (!err) {
                          console.log("added status");
                        }
                      }
                    );
                    console.log("sucess!");
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
                        if (!err) {
                          console.log("added status");
                        }
                      }
                    );
                    console.log("sucess!");
                  }
                }
              );
              Product.updateMany(
                { "user.unique_id": found.unique_id },
                { "user.bio": fields.bio },
                function (err) {
                  if (!err) {
                    console.log("products user updated");
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
                        if (!err) {
                          console.log("added status");
                        }
                      }
                    );
                    console.log("sucess!");
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
                        if (!err) {
                          console.log("added status");
                        }
                      }
                    );
                    console.log("sucess!");
                  }
                }
              );
              Product.updateMany(
                { "user.unique_id": found.unique_id },
                { "user.email": fields.email },
                function (err) {
                  if (!err) {
                    console.log("products user updated");
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
});
router.post("/useDiscount",async(req,res)=>{
  res.redirect(`/cart?discountCode=${req.body.discountCode}`);

});

router.post("/generateD", async (req, res) => {
  var c;
  Discount.findOne({}, function (err, data) {
    if (data) {
      c = data.unique_id + 1;
    } else {
      c = 1;
    }
    User.findOne({ unique_id: req.session.userId }, function (err, found) {
      if (!err) {
        if (found) {
          const discount = new Discount({
            amount: req.body.amount,
            fromDate: req.body.fromDate,
            toDate: req.body.toDate,
            unique_id: c,
            userId: found.unique_id,
            code: discountGenerator.getDiscount().toString(),
            date: new Date(),
          });
          discount.save(function (err, docs) {
            if (!err) {
              console.log("message sent");
              let discountCreated = {
                message: `discount code added`,
                code: "000",
                date: newDate(new Date()),
              };
              User.updateOne(
                {
                  unique_id: req.session.userId,
                },
                {
                  $push: { message: discountCreated },
                },
                function (err) {
                  if (!err) {
                    console.log("added status");
                  }
                }
              );
              res.redirect("/dashboard");
            } else {
              console.log(err);
              res.redirect("/dashboard");
            }
          });
        }
      }
    });
  })
    .sort({ _id: -1 })
    .limit(1);
});
router.post("/removeFund", async (req, res) => {
  User.findOne({ unique_id: req.session.userId }, function (err, user) {
    if (user.balance && user.balance >= req.body.price) {
      const currentAmount = (
        parseFloat(user.balance) - parseFloat(req.body.price)
      ).toString();
      User.updateOne(
        { unique_id: req.session.userId },
        { balance: currentAmount },
        function (err) {
          if (!err) {
            res.redirect("home");
          }
        }
      );
    } else {
      res.redirect("home");
    }
  });
});

router.post("/addFund", async (req, res) => {
  function isNumeric(num) {
    return !isNaN(num);
  }
  if (isNumeric(req.body.amount)) {
    User.findOne({ unique_id: req.session.userId }, function (err, user) {
      if (!user.balance || user.balance === undefined) {
        User.updateOne(
          { unique_id: req.session.userId },
          { balance: parseFloat(req.body.amount).toString() },
          function (err) {
            if (!err) {
              res.redirect("dashboard");
            }
          }
        );
      } else {
        const currentAmount = (
          parseFloat(user.balance) + parseFloat(req.body.amount)
        ).toString();
        User.updateOne(
          { unique_id: req.session.userId },
          { balance: currentAmount },
          function (err) {
            if (!err) {
              res.redirect("dashboard");
            }
          }
        );
      }
    });
  } else {
    res.redirect("dashboard");
  }
});

router.post("/getFund", async (req, res) => {
  res.redirect("dashboard");
});
router.post("/sendMessage", async (req, res) => {
  var c;
  Message.findOne({}, function (err, data) {
    if (data) {
      c = data.unique_id + 1;
    } else {
      c = 1;
    }
    User.findOne({ unique_id: req.session.userId }, function (err, found) {
      if (!err) {
        if (found) {
          const message = new Message({
            message: req.body.message,
            user: found,
            unique_id: c,
            date: new Date(),
            answered: false,
          });
          message.save(function (err, docs) {
            if (!err) {
              console.log("message sent");
              let messageSent = {
                message: `message sent`,
                code: "000",
                date: newDate(new Date()),
              };
              User.updateOne(
                {
                  unique_id: req.session.userId,
                },
                {
                  $push: { message: messageSent },
                },
                function (err) {
                  if (!err) {
                    console.log("added status");
                  }
                }
              );
              res.redirect("/dashboard");
            } else {
              console.log(err);
              res.redirect("/dashboard");
            }
          });
        }
      }
    });
  })
    .sort({ _id: -1 })
    .limit(1);
});

router.post("/addCard", async (req, res) => {
  User.updateOne(
    { unique_id: req.session.userId },
    { creditCardConfirmation: "wait" },
    function (err) {
      if (!err) {
        console.log("waiting for confirmation");
      }
    }
  );
  User.findOne({ unique_id: req.session.userId }, function (err, found) {
    if (!err) {
      if (found) {
        const creditCard = new CreditCard({
          cardNumber: req.body.cardNumber,
          name: req.body.name,
          sId: req.body.sId,
          user: found,
          date: new Date(),
        });
        creditCard.save(function (err, docs) {
          if (!err) {
            console.log("credirCard added");
            let cardAdded = {
              message: `card added`,
              code: "000",
              date: newDate(new Date()),
            };
            User.updateOne(
              {
                unique_id: req.session.userId,
              },
              {
                $push: { message: cardAdded },
              },
              function (err) {
                if (!err) {
                  console.log("added status");
                }
              }
            );
            res.redirect("/dashboard");
          } else {
            console.log(err);
            res.redirect("/dashboard");
          }
        });
      }
    }
  });
});

router.get("/download/:productId/:type", function (req, res) {
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
});

router.get("/", function (req, res) {
  Product.find({ confirmation: true })
    .limit(10)
    .sort({ downloadedCount: "desc" })
    .exec(function (err, bestSales) {
      Product.find({ confirmation: true })
        .sort({ rating: "desc" })
        .exec(function (err, bestOfAll) {
          Product.find({ confirmation: true })
            .sort({ date: "desc" })
            .exec(function (err, latest) {
              if (req.session.userId) {
                User.findOne(
                  {
                    unique_id: req.session.userId,
                  },
                  function (err, found) {
                    if (!err) {
                      if (found) {
                        res.render("home", {
                          loggedIn: true,
                          bestOfAll: bestOfAll,
                          bestSales: bestSales,
                          latest: latest,
                        });
                      }
                    }
                  }
                );
              } else {
                res.render("home", {
                  loggedIn: false,
                  bestOfAll: bestOfAll,
                  bestSales: bestSales,
                  latest: latest,
                });
              }
            });
        });
    });
});

router.get("/tags/:tag", function (req, res) {
  var sort = {};
  var sortby = "مرتبط ترین";
  if (!Array.isArray(req.query.sortby)) {
    switch (req.query.sortby) {
      case "lowPrice":
        sort = { orginalPrice: "asc" };
        sortby = "ارزان ترین";
        break;
      case "highPrice":
        sort = { orginalPrice: "desc" };
        sortby = "گرانترین";
        break;
      case "mostView":
        sort = { downloadedCount: "desc" };
        sortby = "بیشترین بازدید";
        break;
      default:
        sort = {};
        sortby = "مرتبط ترین";
    }
  } else {
    switch (req.query.sortby[req.query.sortby.length - 1]) {
      case "lowPrice":
        sort = { orginalPrice: "asc" };
        sortby = "ارزان ترین";
        break;
      case "highPrice":
        sort = { orginalPrice: "desc" };
        sortby = "گرانترین";
        break;
      case "mostView":
        sort = { downloadedCount: "desc" };
        sortby = "بیشترین بازدید";
        break;
      default:
        sort = {};
        sortby = "مرتبط ترین";
    }
  }
  tagss = "#" + req.params.tag;

  Product.find({ tags: { $in: tagss } })
    .sort(sort)
    .exec(function (err, found) {
      res.render("search", {
        searched: found,
        searchedItem: req.params.tag,
        sortby: sortby,
        link: req.url,
      });
    });
});

router.get("/login", function (req, res) {
  if (req.session.userId) {
    res.redirect("/dashboard");
  } else {
    res.render("login", {
      inputFouned: false,
      inputVerify: true,
      loginInput: req.body.loginInput,
      newUser: false,
      back: true,
    });
  }
});

router.get("/dashboard", function (req, res) {
  if (req.session.userId) {
    User.findOne(
      {
        unique_id: req.session.userId,
      },
      function (err, found) {
        if (found) {
          Product.find({ "user.unique_id": found.unique_id }).exec(function (
            err,
            products
          ) {
            Order.find(
              { "user.unique_id": req.session.userId },
              function (err, orders) {
                Discount.find(
                  { userId: req.session.userId },
                  function (err, discounts) {
                    if (!err) {
                      if (discounts) {
                        Message.find(
                          { "user.unique_id": req.session.userId },
                          function (err, messages) {
                            if (!err) {
                              res.render("dashboard", {
                                user: found,
                                searched: products,
                                statusMessage: found.message,
                                date: newDate(new Date()),
                                orders: orders,
                                discounts: discounts,
                                messages: messages,
                                error1: null,
                              });
                            }
                          }
                        );
                      }
                    }
                  }
                );
              }
            );
          });
        } else {
          res.render("notFound");
        }
      }
    );
  }
});
router.get("/dashboard:error", function (req, res) {
  var error = req.params.error.split("&error=")[1];
  if (error === "notUploader") {
    if (req.session.userId) {
      User.findOne(
        {
          unique_id: req.session.userId,
        },
        function (err, found) {
          if (found) {
            Product.find({ "user.unique_id": found.unique_id }).exec(function (
              err,
              products
            ) {
              Order.find(
                { "user.unique_id": req.session.userId },
                function (err, orders) {
                  Discount.find(
                    { userId: req.session.userId },
                    function (err, discounts) {
                      if (!err) {
                        if (discounts) {
                          Message.find(
                            { "user.unique_id": req.session.userId },
                            function (err, messages) {
                              if (!err) {
                                res.render("dashboard", {
                                  user: found,
                                  searched: products,
                                  statusMessage: found.message,
                                  date: newDate(new Date()),
                                  orders: orders,
                                  discounts: discounts,
                                  messages: messages,
                                  error1: error,
                                });
                              }
                            }
                          );
                        }
                      }
                    }
                  );
                }
              );
            });
          }
        }
      );
    }
  } else {
    res.render("notFound");
  }
});

router.get("/dashboard/orders/:orderId", function (req, res) {
  var orderId = req.params.orderId;
  if (req.session.userId) {
    Order.find({ orderId: orderId }, function (err, order) {
      console.log(order[0]);
      if (order.length > 0) {
        res.render("order", { order: order[0] });
      }
    });
  } else {
    res.redirect("/login");
  }
});
router.get("/orders", function (req, res) {
  res.render("orders");
});

router.get("/user", function (req, res) {
  res.render("user");
});

router.get("/upload", function (req, res) {
  if (req.session.userId) {
    User.findOne({ unique_id: req.session.userId }, function (err, user) {
      if (user.type == "Uploader") res.render("upload");
      else {
        res.redirect("/dashboard&error=notUploader");
      }
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/contact-us", function (req, res) {
  res.render("contactUs");
});

router.get("/cart",(req, res)=>{
 
  if (!req.session.userId) {
    res.redirect("/login");
  }
  var cart = new Cart(req.session.cart || {});
  if(req.query.discountCode){
    
  Discount.findOne({code:req.query.discountCode},async(err,dCode)=>{

    if(dCode){

      let itemCounter=0;
      Object.keys(cart.items).forEach((key)=>{
       Product.findOne({productId:key},(err,product)=>{
          if(product){
            if(product.user.unique_id==dCode.userId){
              itemCounter++;
              req.session.itemCounter=itemCounter;
              req.session.save();
            }
          }
        });
      });

      const dDate=dCode.toDate.split("-").map(Number);
      const nDate=new Date();
      if(dDate[0]>=nDate.getFullYear() && dDate[1]>=nDate.getMonth()+1 && dDate[2]>=nDate.getDate()){


        if(req.session.itemCounter==cart.totalQty){
          res.render("cart", {
            discountIsValid:true,
            discountDate:true,
            discountForProduct:true,
            discountEntered:true,
            discount:dCode,
            products: cart.generateArray(),
            totalPrice: cart.totalPrice,
            totalQty: cart.totalQty,
          });
        }else{
          res.render("cart", {
            discountIsValid:true,
            discountDate:true,
            discountForProduct:false,
            discountEntered:true,
            discount:dCode,
            products: cart.generateArray(),
            totalPrice: cart.totalPrice,
            totalQty: cart.totalQty,
          });
        }
        
      }else{
        if(req.session.itemCounter==cart.totalQty){
          res.render("cart", {
            discountIsValid:true,
            discountDate:false,
            discountForProduct:true,
            discountEntered:true,
            discount:dCode,
            products: cart.generateArray(),
            totalPrice: cart.totalPrice,
            totalQty: cart.totalQty,
          });
        }else{
          res.render("cart", {
            discountIsValid:true,
            discountDate:false,
            discountForProduct:false,
            discountEntered:true,
            discount:dCode,
            products: cart.generateArray(),
            totalPrice: cart.totalPrice,
            totalQty: cart.totalQty,
          });
        }

      }
      
    }else{      
      res.render("cart", {
        discountIsValid:false,
        discountDate:false,
        discountForProduct:false,
        discountEntered:true,
        discount:"undefiend",
        products: cart.generateArray(),
        totalPrice: cart.totalPrice,
        totalQty: cart.totalQty,
      });
    }
  });



  }else{
    res.render("cart", {
      discountIsValid:false,
      discountDate:false,
      discountForProduct:false,
      discountEntered:false,
      discount:"undefiend",
      products: cart.generateArray(),
      totalPrice: cart.totalPrice,
      totalQty: cart.totalQty,
    });

  }

  


});

router.get("/delete-from-cart/:id", function (req, res) {
  if (req.session.userId) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.delete(productId);
    req.session.cart = cart;
    req.session.save();
    res.redirect("/cart");
  }
});
router.get("/add-to-cart/:id/:type", function (req, res) {
  if (req.session.userId) {
    var productId = req.params.id;
    var type = req.params.type;

    console.log(req.session.cart);
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    let product = Product.findOne(
      {
        _id: productId,
      },
      function (err, product) {
        if (err) {
          console.log("item adding failed");
          res.render("notFound");
        }
        product.filePath.forEach((file) => {
          if (file.fileType === type) {
            console.log(type);
            cart.add(product, product.productId, type);
            req.session.cart = cart;
            req.session.save((err, savedCart) => {
              if (err) console.log(err);
              else {
                res.redirect("/cart");
              }
            });
          }
        });
      }
    );
  } else {
    res.redirect("/login");
  }
});

router.get("/orderConfirm", function (req, res) {
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1;
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();

  var newdate = year + "/" + month + "/" + day;
  

  if (req.session.userId) {
    User.findOne(
      {
        unique_id: req.session.userId,
      },
      function (err, found) {
        if (found) {
          if (req.session.cart) {
            const cart = new Cart(req.session.cart).generateArray();
            cart.forEach(item=>{
              Product.findOneAndUpdate({productId:item.item.productId},{$inc :{downloadedCount:1}},(err)=>{
                if(err){
                  console.log(err);
                }
              });
            });

            const order = new Order({
              user: found,
              quantity: req.session.cart.totalQty,
              totalPrice: req.session.cart.totalPrice,
              date: newdate,
              code: discountGenerator.getDiscount().toString(),
            });
            for (var i = 0; i < cart.length; i++) {
              var product = {
                product: cart[i].item,
                type: cart[i].type,
              };
              console.log(product);
              order.products.push(product);
              found.products.push(product);
            }
            order.save();
            found.save();
            req.session.cart = null;
            req.session.save();
            res.redirect("/cart");
          }
        } else {
          res.redirect("/login");
        }
      }
    );
  }
});

router.get("/about-us", function (req, res) {
  res.render("aboutUs");
});

router.get("/edit/:uniqueId/:itemID/:itemName", function (req, res) {
  if (req.session.userId == req.params.uniqueId) {
    Product.find({ $text: { $search: req.params.itemName } })
      // .skip(20)
      // .limit(10)
      .exec(function (err, searchedItem) {
        Product.findOne(
          {
            productId: req.params.itemID,
          },
          function (err, found) {
            if (found) {
              res.render("editProduct", { product: found });
            } else {
              res.render("notFound");
            }
          }
        );
      });
  } else {
    res.render("notFound");
  }
});

router.get("/Product/:itemID/:itemName", function (req, res) {
  const link = req.params.itemID;
  Product.find({ $text: { $search: req.params.itemName } }).exec(function (
    err,
    searchedItem
  ) {
    Product.findOne(
      {
        productId: link,
      },
      function (err, found) {
        if (found && (found.confirmation || req.session.userId == 0)) {
          if (found.user.unique_id == req.session.userId) {
            res.render("productDetail", {
              item: found,
              searched: searchedItem,
              admin: "true",
              boughtTypes: ["None"],
            });
          } else {
            if (req.session.userId) {
              User.findOne(
                {
                  unique_id: req.session.userId,
                  "products.product.productId": found.productId,
                },
                {},
                function (err, found1) {
                  if (found1) {
                    var boughtTypes = [];
                    found1.products.forEach(function (product) {
                      boughtTypes.push(product.type);
                    });
                    console.log(boughtTypes);
                    res.render("productDetail", {
                      item: found,
                      searched: searchedItem,
                      admin: "false",
                      boughtTypes: boughtTypes,
                    });
                  } else {
                    res.render("productDetail", {
                      item: found,
                      searched: searchedItem,
                      admin: "false",
                      boughtTypes: ["None"],
                    });
                  }
                }
              );
            } else {
              res.render("productDetail", {
                item: found,
                searched: searchedItem,
                admin: "false",
                boughtTypes: ["None"],
              });
            }
          }
        } else {
          res.render("notFound");
        }
      }
    );
  });
});

router.get("/logout", function (req, res, next) {
  console.log("logout");
  if (req.session.userId) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect("/");
      }
    });
  }
});

router.get("/:userName", function (req, res) {
  if (req.params.userName.toLowerCase() != "logout") {
    User.findOne(
      {
        userName: req.params.userName.toLowerCase(),
      },
      function (err, found) {
        if (found) {
          Product.find({ "user.unique_id": found.unique_id }).exec(function (
            err,
            products
          ) {
            res.render("user", { user: found, searched: products });
          });
        } else {
          res.render("notFound");
        }
      }
    );
  }
});

// END OF GET ROUTE'S

// POST ROUTE's

router.post("/sendAgain", async (req, res) => {
  generateOTP.newOtp(req.body.phone);
});

router.post(
  "/login",
  [
    check("loginInput", "phoneNumber")
      .isMobilePhone()
      .isLength({ min: 11, max: 11 })
      .not()
      .isEmpty(),
  ],
  async (req, res, next) => {
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
  }
);

//verify Code register
router.post("/register", async (req, res) => {
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
            console.log(
              '"' +
                req.body.loginInput +
                '"' +
                " entered the verify code correctly"
            );
            User.updateOne(
              {
                email: req.body.loginInput,
              },
              {
                verified: true,
              },
              function (err, docs) {
                if (!err) {
                  console.log(
                    '"' + req.body.loginInput + '"' + " is now verified!"
                  );
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
            console.log(
              '"' +
                req.body.loginInput +
                '"' +
                " entered the wrong verify code!"
            );
            User.updateMany(
              {
                email: req.body.loginInput,
              },
              {
                verifyCode: generateOTP.createNewOTP(),
                verified: false,
              },
              function (err, docs) {
                if (!err) {
                  console.log(
                    '"' + req.body.loginInput + '"' + " verify code updated!"
                  );
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
            console.log(
              '"' +
                req.body.loginInput +
                '"' +
                " entered the verify code correctly"
            );
            User.updateOne(
              {
                phone: req.body.loginInput,
              },
              {
                verified: true,
              },
              function (err, docs) {
                if (!err) {
                  console.log(
                    '"' + req.body.loginInput + '"' + " is now verified!"
                  );
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
            console.log(
              '"' +
                req.body.loginInput +
                '"' +
                " entered the wrong verify code!"
            );
            User.updateMany(
              {
                phone: req.body.loginInput,
              },
              {
                verifyCode: generateOTP.createNewOTP(),
                verified: false,
              },
              function (err, docs) {
                if (!err) {
                  console.log(
                    '"' + req.body.loginInput + '"' + " verify code updated!"
                  );
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
});

router.post("/signUpD", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const form = formidable({ multiples: true });
  form.keepExtensions = true;
  form.maxFileSize = 10 * 1024 * 1024;
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
});
router.post("/signUpU", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const dir = path.join(__dirname, "/../public/profilePic/users/");
  console.log(dir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
      recursive: true,
    });
  }
  const form = formidable({ multiples: true, uploadDir: dir });
  form.keepExtensions = true;
  form.maxFileSize = 10 * 1024 * 1024;
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
});
router.post(
  "/signIn",
  // check('passwordConfirmation').not().isEmpty().isLength({min:8}).custom((value,{req}) =>{
  //   if(value != req.body.password){
  //     throw new Error("Password confirmation does not match password");
  //   }
  //   return true;
  //
  // }),

  async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      console.log(errors);
    }

    var dir = "public/covers/users/";
    const form = formidable({ multiples: true, uploadDir: dir });
    form.keepExtensions = true;
    form.maxFileSize = 10 * 1024 * 1024;
    form.parse(req, (err, fields, files) => {
      console.log(files.profilePic);
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
                    console.log(
                      '"' + fields.loginInput + '"' + " login was successful!"
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
                  if (!validPassword) {
                    console.log(
                      '"' +
                        fields.loginInput +
                        '"' +
                        " entered the wrong password!"
                    );
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
                    console.log(
                      '"' + fields.loginInput + '"' + " login was successful!"
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
                  if (!validPassword) {
                    console.log(
                      '"' +
                        fields.loginInput +
                        '"' +
                        " entered the wrong password!"
                    );
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
  }
);

router.post("/upload", async (req, res) => {
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
            "/../uploads/users/" +
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
            "/../public/covers/users/" +
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
          form.maxFileSize = 10 * 1024 * 1024;
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

            tagsarr = fields.tags.split(" ");
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
});

router.post("/editProduct/:productId", async (req, res, next) => {
  const form = formidable({ multiples: true });
  form.keepExtensions = true;
  form.maxFileSize = 10 * 1024 * 1024;
  form.parse(req, (err, fields, files) => {
    Product.findOne({ productId: req.params.productId }, function (err, found) {
      if (!err) {
        if (found) {
          if (found.tags && !fields.tags) {
            tagsarr = fields.tags.split(" ");
            for (var i = 0; i < tagsarr.length; i++) {
              if (
                (tagsarr[i].includes("#") && tagsarr[i].length == 1) ||
                !tagsarr[i].includes("#")
              ) {
                delete tagsarr[i];
              }
            }
            tagsarr = tagsarr.filter(function (e) {
              return e;
            });

            Product.updateOne(
              {
                productId: req.params.productId,
              },
              {
                tags: fields.tags,
              },
              function (err) {
                if (!err) {
                  console.log("sucess!");
                }
              }
            );
          }
          if (fields.tags != found.tags && fields.tags) {
            tagsarr = fields.tags.split(" ");
            for (var i = 0; i < tagsarr.length; i++) {
              if (
                (tagsarr[i].includes("#") && tagsarr[i].length == 1) ||
                !tagsarr[i].includes("#")
              ) {
                delete tagsarr[i];
              }
            }
            tagsarr = tagsarr.filter(function (e) {
              return e;
            });

            Product.updateOne(
              {
                productId: req.params.productId,
              },
              {
                tags: tagsarr,
              },
              function (err) {
                if (!err) {
                  console.log("sucess!");
                }
              }
            );
          }

          if (fields.fileName != found.fileName && fields.fileName) {
            Product.updateOne(
              {
                productId: req.params.productId,
              },
              {
                fileName: fields.fileName,
              },
              function (err) {
                if (!err) {
                  console.log("sucess!");
                }
              }
            );
          }
          if (found.description && !fields.description) {
            Product.updateOne(
              {
                productId: req.params.productId,
              },
              {
                description: fields.description,
              },
              function (err) {
                if (!err) {
                  console.log("sucess!");
                }
              }
            );
          }

          if (fields.description != found.description && fields.description) {
            Product.updateOne(
              {
                productId: req.params.productId,
              },
              {
                description: fields.description,
              },
              function (err) {
                if (!err) {
                  console.log("sucess!");
                }
              }
            );
          }

          if (
            fields.orginalPrice != found.orginalPrice &&
            fields.orginalPrice
          ) {
            Product.updateOne(
              {
                productId: req.params.productId,
              },
              {
                orginalPrice: fields.orginalPrice,
              },
              function (err) {
                if (!err) {
                  console.log("sucess!");
                }
              }
            );
          }

          if (fields.mediumPrice != found.mediumPrice && fields.mediumPrice) {
            Product.updateOne(
              {
                productId: req.params.productId,
              },
              {
                mediumPrice: fields.mediumPrice,
              },
              function (err) {
                if (!err) {
                  console.log("sucess!");
                }
              }
            );
          }

          if (fields.largePrice != found.largePrice && fields.largePrice) {
            Product.updateOne(
              {
                productId: req.params.productId,
              },
              {
                largePrice: fields.largePrice,
              },
              function (err) {
                if (!err) {
                  console.log("sucess!");
                }
              }
            );
          }

          if (fields.smallPrice != found.smallPrice && fields.smallPrice) {
            Product.updateOne(
              {
                productId: req.params.productId,
              },
              {
                smallPrice: fields.smallPrice,
              },
              function (err) {
                if (!err) {
                  console.log("sucess!");
                }
              }
            );
          }

          if (err) {
            next(err);
            let failedUpload = {
              message: `${fields.fileName} upload failed`,
              code: "222",
              date: newDate(new Date()),
            };
            Product.updateOne(
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
            Product.findOne(
              { productId: req.params.productId },
              function (err, found) {
                if (!err) {
                  let successfulUpload = {
                    message: `${found.fileName} changed`,
                    code: "111",
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
              }
            );
            res.redirect(`/Product/${found.productId}/${found.fileName}`);
          }
        }
      }
    });
  });
});

router.post("/changeUserInfoU", async (req, res, next) => {
  const dir = path.join(__dirname, "/../public/profilePic/users/");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
      recursive: true,
    });
  }

  const form = formidable({ multiples: true, uploadDir: dir });
  form.keepExtensions = true;
  form.maxFileSize = 10 * 1024 * 1024;
  form.parse(req, (err, fields, files) => {
    User.findOne(
      {
        unique_id: req.session.userId,
      },
      async (err, found) => {
        if (!err) {
          if (found) {
            const validPassword = await bcrypt.compare(
              ields.oldPassword,
              found.password
            );
            if (fields && validPassword) {
              if (
                files.profilePic != found.profilePic &&
                files.profilePic &&
                files.profilePic.size != 0
              ) {
                console.log("true");
                var profilePicPath = "";
                var fileName = path.basename(files.profilePic.path);
                var newPath = path.join("/profilePic/users/", fileName);

                if (files.profilePic.size != 0) profilePicPath = newPath;
                else profilePicPath = "no picture";

                const removeDir = path.join(
                  __dirname,
                  "/../public",
                  found.profilePicPath
                );
                fs.unlink(removeDir, (err) => {
                  if (err) {
                    console.error(err);
                    return;
                  }

                  console.log("file removed");
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
                          if (!err) {
                            console.log("added status");
                          }
                        }
                      );

                      console.log("sucess!");
                    }
                  }
                );
                Product.updateMany(
                  { "user.unique_id": found.unique_id },
                  { "user.prodilePicPath": fields.prodilePicPath },
                  function (err) {
                    if (!err) {
                      console.log("products user updated");
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
                          if (!err) {
                            console.log("added status");
                          }
                        }
                      );
                      console.log("sucess!");
                    }
                  }
                );
                Product.updateMany(
                  { "user.unique_id": found.unique_id },
                  { "user.firstName": fields.firstName },
                  function (err) {
                    if (!err) {
                      console.log("products user updated");
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
                          if (!err) {
                            console.log("added status");
                          }
                        }
                      );

                      console.log("sucess!");
                    }
                  }
                );
                Product.updateMany(
                  { "user.unique_id": found.unique_id },
                  { "user.lastName": fields.lastName },
                  function (err) {
                    if (!err) {
                      console.log("products user updated");
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
                              if (!err) {
                                console.log("added status");
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
                                  if (!err) {
                                    console.log("added status");
                                  }
                                }
                              );

                              console.log("sucess!");
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
                    if (!err) {
                      console.log("products user updated");
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
                          if (!err) {
                            console.log("added status");
                          }
                        }
                      );
                      console.log("sucess!");
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
                          if (!err) {
                            console.log("added status");
                          }
                        }
                      );
                      console.log("sucess!");
                    }
                  }
                );
                Product.updateMany(
                  { "user.unique_id": found.unique_id },
                  { "user.instagram": fields.instagram },
                  function (err) {
                    if (!err) {
                      console.log("products user updated");
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
                          if (!err) {
                            console.log("added status");
                          }
                        }
                      );
                      console.log("sucess!");
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
                          if (!err) {
                            console.log("added status");
                          }
                        }
                      );
                      console.log("sucess!");
                    }
                  }
                );
                Product.updateMany(
                  { "user.unique_id": found.unique_id },
                  { "user.twitter": fields.twitter },
                  function (err) {
                    if (!err) {
                      console.log("products user updated");
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
                          if (!err) {
                            console.log("added status");
                          }
                        }
                      );
                      console.log("sucess!");
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
                          if (!err) {
                            console.log("added status");
                          }
                        }
                      );
                      console.log("sucess!");
                    }
                  }
                );
                Product.updateMany(
                  { "user.unique_id": found.unique_id },
                  { "user.bio": fields.bio },
                  function (err) {
                    if (!err) {
                      console.log("products user updated");
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
                          if (!err) {
                            console.log("added status");
                          }
                        }
                      );
                      console.log("sucess!");
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
                          if (!err) {
                            console.log("added status");
                          }
                        }
                      );
                      console.log("sucess!");
                    }
                  }
                );
                Product.updateMany(
                  { "user.unique_id": found.unique_id },
                  { "user.email": fields.email },
                  async (err) => {
                    if (!err) {
                      console.log("products user updated");
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
                          if (!err) {
                            console.log("added status");
                          }
                        }
                      );
                      console.log("sucess!");
                    }
                  }
                );
                Product.updateMany(
                  { "user.unique_id": found.unique_id },
                  { "user.password": await bcrypt.hash(fields.password, salt) },
                  function (err) {
                    if (!err) {
                      console.log("products user updated");
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
                  if (!err) {
                    console.log("added status");
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
});
router.post("/changeUserInfoD", async (req, res, next) => {
  const dir = path.join(__dirname, "/../public/profilePic/users/");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
      recursive: true,
    });
  }

  const form = formidable({ multiples: true, uploadDir: dir });
  form.keepExtensions = true;
  form.maxFileSize = 10 * 1024 * 1024;
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
                          if (!err) {
                            console.log("added status");
                          }
                        }
                      );
                      console.log("sucess!");
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
                          if (!err) {
                            console.log("added status");
                          }
                        }
                      );

                      console.log("sucess!");
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
                          if (!err) {
                            console.log("added status");
                          }
                        }
                      );

                      console.log("sucess!");
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
                          if (!err) {
                            console.log("added status");
                          }
                        }
                      );
                      console.log("sucess!");
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
                  if (!err) {
                    console.log("added status");
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
});

// searches

router.post("/search/advanced/home", async (req, res) => {
  Object.entries(req.body).forEach(([key, value]) => {
    Product.find({})
      .where(value)
      .equals(key)
      .exec(function (err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log(data);
          console.log("============");
        }
      });
  });
});

router.post("/search/home", async (req, res) => {
  if (req.body.searchedItem == "" || req.body.searchedItem == " ") {
    res.redirect("/");
  } else {
    res.redirect("/search/home/" + req.body.searchedItem);
  }
});

router.get("/search/home/:searchedItem", function (req, res) {
  //   Product.search(req.params.searchedItem, function(err, found) {
  //     res.render("search",{searched:found});
  //  });
  console.log(req.query);
  var sort = {};
  var sortby = "مرتبط ترین";
  if (!Array.isArray(req.query.sortby)) {
    switch (req.query.sortby) {
      case "lowPrice":
        sort = { orginalPrice: "asc" };
        sortby = "ارزان ترین";
        break;
      case "highPrice":
        sort = { orginalPrice: "desc" };
        sortby = "گرانترین";
        break;
      case "mostView":
        sort = { downloadedCount: "desc" };
        sortby = "بیشترین بازدید";
        break;
      default:
        sort = {};
        sortby = "مرتبط ترین";
    }
  } else {
    switch (req.query.sortby[req.query.sortby.length - 1]) {
      case "lowPrice":
        sort = { orginalPrice: "asc" };
        sortby = "ارزان ترین";
        break;
      case "highPrice":
        sort = { orginalPrice: "desc" };
        sortby = "گرانترین";
        break;
      case "mostView":
        sort = { downloadedCount: "desc" };
        sortby = "بیشترین بازدید";
        break;
      default:
        sort = {};
        sortby = "مرتبط ترین";
    }
  }

  var typesFilter =
    req.query.types !== undefined
      ? { $in: req.query.types }
      : { $not: { $in: [] } };
  var fileTypesFilter =
    req.query.fileTypes !== undefined
      ? { $in: req.query.fileTypes }
      : { $not: { $in: [] } };
  Product.find({
    confirmation: true,
    $and: [
      {
        $or: [
          { fileName: new RegExp(req.params.searchedItem, "gi") },
          { "user.userName": new RegExp(req.params.searchedItem, "gi") },
          { tags: new RegExp(req.params.searchedItem, "gi") },
          { "user.firstName": new RegExp(req.params.searchedItem, "gi") },
          { fileType: new RegExp(req.params.searchedItem, "gi") },
          { type: new RegExp(req.params.searchedItem, "gi") },
        ],
      },
      { filePath: { $elemMatch: { fileType: fileTypesFilter } } },

      { type: typesFilter },
    ],
  })
    .sort(sort)
    .exec(function (err, found) {
      if (found) {
        res.render("search", {
          searched: found,
          searchedItem: req.params.searchedItem,
          sortby: sortby,
          link: req.url,
        });
      }
    });
});
router.post("/search/advanced/home/:searchedItem", async (req, res) => {
  //   Product.search(req.params.searchedItem, function(err, found) {
  //     res.render("search",{searched:found});
  //  });
  console.log(req.body);
  var fileTypes = "";
  var types = "";
  var dimensions = "";
  var price = "";
  var link = "";
  Object.entries(req.body).map((key) => {
    if (key[1] == "type") {
      types = types.concat("types[]=" + key[0] + "&");
    }
    if (key[1] == "fileType") {
      fileTypes = fileTypes.concat("fileTypes[]=" + key[0] + "&");
    }
    if (key[1] == "dimension") {
      dimensions = dimensions.concat("dimensions[]=" + key[0] + "&");
    }
    if (key[1] == "free" || key[1] == "non-free") {
      price = price.concat("price[]=" + key[0] + "&");
    }
  });
  link = link.concat(types);
  link = link.concat(fileTypes);
  link = link.concat(dimensions);
  link = link.concat(price);

  res.redirect(`/search/home/${req.params.searchedItem}?${link}`);
  // if (fileTypeArray.length == 0) {
  //   fileTypeArray = ["image/png", "image/jpeg", "video/mp4", "file/psd"];
  // }
  // if (types.length == 0) {
  //   fileTypeArray = ["clip", "graphic", "photo", "gif"];
  // }

  // Product.find(
  //   {
  //     confirmation: true,
  //     $and: [
  //       {
  //         $or: [
  //           { fileName: new RegExp(req.params.searchedItem, "gi") },
  //           { "user.userName": new RegExp(req.params.searchedItem, "gi") },
  //           { tags: new RegExp(req.params.searchedItem, "gi") },
  //           { "user.firstName": new RegExp(req.params.searchedItem, "gi") },
  //           { fileType: new RegExp(req.params.searchedItem, "gi") },
  //           { type: new RegExp(req.params.searchedItem, "gi") },
  //         ],
  //       },

  //       { filePath: { $elemMatch: { fileType: { $in: fileTypeArray } } } },

  //       { type: { $in: types } },
  //     ],
  //   },
  //   function (err, found) {
  //     if (found) {
  //       res.render("search", {
  //         searched: found,
  //         searchedItem: req.params.searchedItem,
  //         sortby: "مرتبط ترین",
  //         link: "/search/advanced/home/",
  //       });
  //     }
  //   }
  // );
});

//finances page search

router.post("/search/admin/finance", async (req, res) => {
  if (req.body.searchedItem == "" || req.body.searchedItem == " ") {
    res.redirect("/admin/finance");
  } else {
    res.redirect("/search/admin/finance/" + req.body.searchedItem);
  }
});

router.get("/search/admin/finance/:searchedItem", function (req, res) {
  //   Product.search(req.params.searchedItem, function(err, found) {
  //     res.render("search",{searched:found});
  //  });
  if (req.session.userId == 0) {
    Order.find(
      {
        $or: [
          { "products.fileName": new RegExp(req.params.searchedItem, "gi") },
          { "user.userName": new RegExp(req.params.searchedItem, "gi") },
          { "user.firstName": new RegExp(req.params.searchedItem, "gi") },
        ],
      },
      function (err, found) {
        res.render("adminFinanceSearch", { searched: found, date: newDate });
      }
    );
  } else {
    res.redirect("/admin/login");
  }
});

//users page search

router.post("/search/admin/users", async (req, res) => {
  if (req.body.searchedItem == "" || req.body.searchedItem == " ") {
    res.redirect("/admin/users");
  } else {
    res.redirect("/search/admin/users/" + req.body.searchedItem);
  }
});

router.get("/search/admin/users/:searchedItem", function (req, res) {
  //   Product.search(req.params.searchedItem, function(err, found) {
  //     res.render("search",{searched:found});
  //  });
  if (req.session.userId == 0) {
    User.find(
      {
        $or: [
          { userName: new RegExp(req.params.searchedItem, "gi") },
          { firstName: new RegExp(req.params.searchedItem, "gi") },
          { lastName: new RegExp(req.params.searchedItem, "gi") },
          { phone: new RegExp(req.params.searchedItem, "gi") },
          { email: new RegExp(req.params.searchedItem, "gi") },
        ],
      },
      function (err, found) {
        res.render("adminUsersSearch", { searched: found, date: newDate });
      }
    );
  } else {
    res.redirect("/admin/login");
  }
});

//products page search

router.post("/search/admin/products", async (req, res) => {
  if (req.body.searchedItem == "" || req.body.searchedItem == " ") {
    res.redirect("/admin/products");
  } else {
    res.redirect("/search/admin/products/" + req.body.searchedItem);
  }
});

router.get("/search/admin/products/:searchedItem", function (req, res) {
  //   Product.search(req.params.searchedItem, function(err, found) {
  //     res.render("search",{searched:found});
  //  });
  if (req.session.userId == 0) {
    Product.find(
      {
        $or: [
          { fileName: new RegExp(req.params.searchedItem, "gi") },
          { "user.userName": new RegExp(req.params.searchedItem, "gi") },
          { tags: new RegExp(req.params.searchedItem, "gi") },
          { "user.firstName": new RegExp(req.params.searchedItem, "gi") },
          { fileType: new RegExp(req.params.searchedItem, "gi") },
          { type: new RegExp(req.params.searchedItem, "gi") },
        ],
      },
      function (err, found) {
        res.render("adminProductsSearch", { searched: found, date: newDate });
      }
    );
  } else {
    res.redirect("/admin/login");
  }
});

//messages page search

router.post("/search/admin/messages", async (req, res) => {
  if (req.body.searchedItem == "" || req.body.searchedItem == " ") {
    res.redirect("/admin/messages");
  } else {
    res.redirect("/search/admin/messages/" + req.body.searchedItem);
  }
});

router.get("/search/admin/messages/:searchedItem", function (req, res) {
  //   Product.search(req.params.searchedItem, function(err, found) {
  //     res.render("search",{searched:found});
  //  });
  if (req.session.userId == 0) {
    Message.find(
      {
        $or: [
          { message: new RegExp(req.params.searchedItem, "gi") },
          { title: new RegExp(req.params.searchedItem, "gi") },
          { response: new RegExp(req.params.searchedItem, "gi") },
          { "user.firstName": new RegExp(req.params.searchedItem, "gi") },
          { "user.lastName": new RegExp(req.params.searchedItem, "gi") },
          { "user.userName": new RegExp(req.params.searchedItem, "gi") },
        ],
      },
      function (err, found) {
        res.render("adminMessagesSearch", { searched: found, date: newDate });
      }
    );
  } else {
    res.redirect("/admin/login");
  }
});

///////////////////////// ADMIN ROUTES ////////////////////////
router.get("/admin/home", function (req, res) {
  if (req.session.userId == 0) {
    res.render("adminHome");
  } else {
    res.redirect("/admin/login");
  }
});

router.get("/admin/login", function (req, res) {
  if (req.session.userId == 0) {
    res.redirect("/admin/home");
  } else {
    res.render("adminLogin");
  }
});

router.post("/admin/login", async (req, res) => {
  if (
    req.body.adminUser == process.env.ADMIN_USER &&
    req.body.password == process.env.ADMIN_PASSWORD
  ) {
    req.session.userId = 0;
    console.log("admin logged in");
    res.redirect("/admin/home");
  }
});

router.get("/admin/finance", function (req, res) {
  if (req.session.userId == 0) {
    Order.find({}, function (err, orders) {
      res.render("adminFinance", { orders: orders, date: newDate });
    });
  } else {
    res.redirect("/admin/login");
  }
});

router.get("/admin/users", function (req, res) {
  if (req.session.userId == 0) {
    User.find({ type: "Uploader" }, function (err, uploader) {
      User.find({ type: "Downloader" }, function (err, downloader) {
        res.render("adminUsers", {
          uploader: uploader,
          downloader: downloader,
          date: newDate,
        });
      });
    });
  } else {
    res.redirect("/admin/login");
  }
});
router.post("/delete/user/:unique_id", async (req, res) => {
  User.deleteOne({ unique_id: req.params.unique_id }, function (err) {
    if (!err) {
      res.redirect("/admin/users");
    }
  });
});

router.get("/admin/messages", function (req, res) {
  if (req.session.userId == 0) {
    Message.find({ answered: true }, function (err, rMessages) {
      Message.find({ answered: false }, function (err, messages) {
        res.render("adminMessages", {
          messages: messages,
          rMessages: rMessages,
          date: newDate,
        });
      });
    });
  } else {
    res.redirect("/admin/login");
  }
});
router.post("/send/message/:messageId/:userId", async (req, res) => {
  Message.updateOne(
    { unique_id: req.params.messageId },
    { response: req.body.response, answered: true, answeredDate: new Date() },
    function (err) {
      if (!err) {
        let messageRecieved = {
          message: `you have recieved a new message`,
          code: "000",
          date: newDate(new Date()),
        };
        User.updateOne(
          { unique_id: req.params.userId },
          { $push: { message: messageRecieved } },
          function (err) {
            if (!err) {
              console.log("added status");
              res.redirect("/admin/messages");
            }
          }
        );
      }
    }
  );
});

router.get("/admin/reqs", function (req, res) {
  if (req.session.userId == 0) {
    res.render("adminReq");
  } else {
    res.redirect("/admin/login");
  }
});

router.get("/admin/products", function (req, res) {
  if (req.session.userId == 0) {
    Product.find({ confirmation: false }, function (err, uProducts) {
      Product.find({ confirmation: true }, function (err, cProducts) {
        res.render("adminProducts", {
          unconfirmedProducts: uProducts,
          confirmedProducts: cProducts,
          date: newDate,
        });
      });
    });
  } else {
    res.redirect("/admin/login");
  }
});

router.post("/confirm/product/:productId", async (req, res) => {
  Product.updateOne(
    { productId: req.params.productId },
    { confirmation: true, date: new Date() },
    function (err) {
      if (!err) {
        res.redirect("/admin/products");
      }
    }
  );
});
router.post("/delete/product/:productId", async (req, res) => {
  Product.deleteOne({ productId: req.params.productId }, function (err) {
    if (!err) {
      res.redirect("/admin/products");
    }
  });
});

///////////////////////// ADMIN ROUTES ////////////////////////

router.get("*", function (req, res) {
  res.render("notFound");
});

module.exports = router;
