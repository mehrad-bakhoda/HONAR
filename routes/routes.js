var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Product = require('../models/product');

const fs = require("fs");
const generateOTP = require("../localModules/generateOTP.js");
const formidable = require('formidable');


// GET ROUTE'S


router.get("/",function(req,res){
  
    res.render("home");
  });

router.get("/search", function (req, res) {
    res.render("search");
});

router.get("/login",function(req,res){
  if (req.session.userId)
  {
    res.redirect("/dashboard")
  }
  res.render("login",{ inputFouned:false,inputVerify:true,loginInput:req.body.loginInput,newUser:false});
  });


router.get("/dashboard",function(req,res){
    res.render("dashboard");
});

router.get("/user", function (req, res) {
    res.render("user");
});



router.get("/upload",function(req,res){
  if(req.session.userId){
    res.render("upload");
  }
  else{
    res.redirect("/login");
  }
  
  });


router.get("/contact-us",function(req,res){
    res.render("contactUs");
  });


router.get("/cart",function(req,res){
    res.render("cart");
  });


router.get("/about-us",function(req,res){
    res.render("aboutUs");
  });


router.get("/product",function(req,res){
    res.render("productDetail");
  });

// END OF GET ROUTE'S



// POST ROUTE's


router.post("/login", function(req,res){
  if(req.body.loginInput.includes("@")===true){
    console.log("Email "+'"'+ req.body.loginInput +'"'+ " received");


    User.findOne({
      email: req.body.loginInput
    }, function(err, found) {
      if (!err) {
        if (found) {
          if(found.verified){
            if(found.hasPassword){
              console.log('"' + req.body.loginInput+'"'+" is verified and has password");

              res.render("login",{inputFouned:true,inputVerify:true,loginInput:req.body.loginInput,newUser:false});
            }
            if(!found.hasPassword){
              console.log('"' + req.body.loginInput+'"'+" is verified but hasn't set the password");
              User.updateMany({email: req.body.loginInput},
              {
                verifyCode: generateOTP.createNewOTP(),
                verified: false
              },
              function(err, docs) {
                if (!err) {
                  console.log('"' + req.body.loginInput+'"'+" verify code updated!");
                }
              });

              res.render("login",{inputFouned:false,inputVerify:false,loginInput:req.body.loginInput,newUser:false});
            }
          }
          if(!found.verified){
            console.log('"' + req.body.loginInput+'"'+" is not verified");
            User.updateMany({email: req.body.loginInput},
            {
              verifyCode: generateOTP.createNewOTP(),
              verified: false
            },
            function(err, docs) {
              if (!err) {
                console.log('"' + req.body.loginInput+'"'+" verify code updated!");
              }
            });

            res.render("login",{inputFouned:false,inputVerify:false,loginInput:req.body.loginInput,newUser:false});
          }


        }
        if (!found) {
          console.log("---------------------- "+'"' + req.body.loginInput+'"'+" is a new User ----------------------");
          var c;
          User.findOne({},function(err,data)
          {
            if (data)
            {
              c = data.unique_id + 1;
            }
            else{
              c = 1;
            }
            const user = new User({
              unique_id: c,
              email: req.body.loginInput,
              verifyCode: generateOTP.createNewOTP(),
              verified: "false",
              registered: "false",
              hasPassword:"false",
            });
            console.log(user.verifyCode)
            user.save(function(err, docs) {
              if (!err) {
                console.log("verify Code initiated!");
              }
              else{
                console.log(err)
              }
            });

          }).sort({_id: -1}).limit(1);
          console.log("Created a user for "+'"' + req.body.loginInput+'"');
          res.render("login",{inputVerify:false,inputFouned:false,loginInput:req.body.loginInput,newUser:false});
        }
      }
    });
  }

else{
    console.log("Phone Number "+'"' + req.body.loginInput+'"' + " received");
    User.findOne({
      phone: req.body.loginInput
    }, function(err, found) {
      if (!err) {
        if (found) {
          if(found.verified){
            if(found.hasPassword){
              console.log('"' + req.body.loginInput+'"'+" is verified and has password");

              res.render("login",{inputFouned:true,inputVerify:true,loginInput:req.body.loginInput,newUser:false});
            }

            if(!found.hasPassword){

              console.log('"' + req.body.loginInput+'"'+" is verified but hasn't set the password");
              User.updateMany({phone: req.body.loginInput},
              {
                verifyCode: generateOTP.createNewOTP(),
                verified: false
              },
              function(err, docs){
                if (!err) {
                  console.log('"' + req.body.loginInput+'"'+" verify code updated!");
                }
              });
              res.render("login",{inputFouned:false,inputVerify:false,loginInput:req.body.loginInput,newUser:false});
            }
          }
          if(!found.verified){
            console.log('"' + req.body.loginInput+'"'+" is not verified");
            User.updateMany({
              phone: req.body.loginInput
            }, {
              verifyCode: generateOTP.createNewOTP(),
              verified: false
            }, function(err, docs) {
              if (!err) {
                console.log('"' + req.body.loginInput+'"'+" verify code updated!");
              }
            });

            res.render("login",{inputFouned:false,inputVerify:false,loginInput:req.body.loginInput,newUser:false});
          }


        }
        if (!found) {
          console.log("---------------------- "+'"' + req.body.loginInput+'"'+" is a new User ----------------------");
          var c;
          User.findOne({},function(err,data)
          {
            if (data)
            {
              c = data.unique_id + 1;
            }
            else{
              c = 1;
            }
            const user = new User({
              unique_id: c,
              phone: req.body.loginInput,
              verifyCode: generateOTP.createNewOTP(),
              verified: "false",
              registered: "false",
              hasPassword:"false",
            });
            console.log(user.verifyCode)
            user.save(function(err, docs) {
              if (!err) {
                console.log("verify Code initiated!");
              }
              else{
                console.log(err)
              }
            });

          }).sort({_id: -1}).limit(1);

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
          console.log("Created a user for "+'"' + req.body.loginInput+'"');

          res.render("login",{inputVerify:false,inputFouned:false,loginInput:req.body.loginInput,newUser:false});

        }
      }


    });
  }

});

//verify Code register
router.post("/register",function(req,res){
  var verifyCode = req.body.verifyCode1.concat(req.body.verifyCode2,req.body.verifyCode3,req.body.verifyCode4,req.body.verifyCode5,req.body.verifyCode6);
  console.log(req.body); 
  if(req.body.loginInput.includes("@")===true){
    User.findOne({
      email: req.body.loginInput
    }, function(err, found) {
      if (!err) {
        if (found.verifyCode == verifyCode) {
          console.log('"' + req.body.loginInput+'"'+" entered the verify code correctly");
          User.updateOne({
            email: req.body.loginInput
          }, {
            verified: true
          }, function(err, docs) {
            if (!err) {
              console.log('"' + req.body.loginInput+'"'+" is now verified!");
            }
          });
          res.render("login",{inputFouned:true,inputVerify:true,loginInput:req.body.loginInput,newUser:true});

        } else {
          console.log('"' + req.body.loginInput+'"'+" entered the wrong verify code!");
          User.updateMany({
            email: req.body.loginInput
          }, {
            verifyCode: generateOTP.createNewOTP(),
            verified: false
          }, function(err, docs) {
            if (!err) {
              console.log('"' + req.body.loginInput+'"'+" verify code updated!");
            }
          });
          res.render("login",{inputVerify:false,inputFouned:false,loginInput:req.body.loginInput,newUser:false});
        }
      }
    });


  }else{
    User.findOne({
      phone: req.body.loginInput
    }, function(err, found) {
      if (!err) {
        if (found.verifyCode == verifyCode) {
          console.log('"' + req.body.loginInput+'"'+" entered the verify code correctly");
          User.updateOne({
            phone: req.body.loginInput
          }, {
            verified: true
          }, function(err, docs) {
            if (!err) {
              console.log('"' + req.body.loginInput+'"'+" is now verified!");
            }
          });
          res.render("login",{inputFouned:true,inputVerify:true,loginInput:req.body.loginInput,newUser:true});

        } else {
          console.log('"' + req.body.loginInput+'"'+" entered the wrong verify code!");
          User.updateMany({
            phone: req.body.loginInput
          }, {
            verifyCode: generateOTP.createNewOTP(),
            verified: false
          }, function(err, docs) {
            if (!err) {
              console.log('"' + req.body.loginInput+'"'+" verify code updated!");
            }
          });
          res.render("login",{inputVerify:false,inputFouned:false,loginInput:req.body.loginInput,newUser:false});
        }
      }
    });
  }


});


router.post("/signIn", function(req, res) {
  const form = formidable({ multiples: true, uploadDir: "./uploads"});
  form.keepExtensions=true;
  form.maxFileSize=10*1024*1024;
  form.parse(req, (err, fields, files) => {
    console.log(fields.loginInput);
    if(fields.loginInput.includes("@")===true){
      User.findOne({
        email: fields.loginInput
      }, function(err, found) {
        if (!err) {
          if(found){
            if(found.verified && found.hasPassword){
              if (found.password === fields.password) {
                console.log('"' + fields.loginInput+'"'+" login was successful!");
                req.session.userId = found.unique_id;
                console.log("Session created for"+'"' + fields.loginInput+'"');
  
                console.log("Redirecting "+'"' + fields.loginInput+'"'+" to home!");
                res.redirect("/");
              }
              if(found.password !== fields.password) {
                     console.log('"' + fields.loginInput+'"'+" entered the wrong password!");
                     res.render("login",{inputFouned:true,inputVerify:true,loginInput:fields.loginInput,newUser:true});
                   }
            }
            if(!found.hasPassword){
              if (fields.userType ==="Downloader")
              {
                console.log("he's a Downloader");
                User.updateMany({
                  email: fields.loginInput
                }, {
                  type:"Downloader",
                  firstName:fields.firstName,
                  lastName:fields.lastName,
                  password: fields.password,
                  hasPassword:true
                }, function(err, docs) {
                  if (!err) {
                    console.log('"' + fields.loginInput+'"'+" now has a password!");
                    req.session.userId = found.unique_id;
                    console.log("Session created for"+'"' + fields.loginInput+'"');
                    console.log("Redirecting "+'"' + fields.loginInput+'"'+" to home!");
                    res.redirect("/");
                  }
                });
              }
              if (fields.userType ==="Uploader")
              {
                User.updateMany({
                  email: fields.loginInput
                }, {
                  type:"Uploader",
                  firstName:fields.firstName,
                  lastName:fields.lastName,
                  userName:fields.userName,
                  instagram:fields.instagram,
                  twitter:fields.twitter,
                  bio:fields.bio,
                  password: fields.password,
                  hasPassword:true
                }, function(err, docs) {
                  if (!err) {
                    console.log('"' + fields.loginInput+'"'+" now has a password!");
                    req.session.userId = found.unique_id;
                    console.log("Session created for"+'"' + fields.loginInput+'"');
                    console.log("Redirecting "+'"' + fields.loginInput+'"'+" to home!");
                    res.redirect("/");
                  }
                });
              }
            }
            if(!found.verified){
              User.updateOne({
                email: fields.loginInput
              }, {
                verifyCode: generateOTP.createNewOTP(),
              }, function(err, docs) {
                if (!err) {
                  console.log('"' + fields.loginInput+'"'+" verify code updated");
                }
                res.render("login",{inputVerify:false,inputFouned:false,loginInput:fields.loginInput,newUser:false});
              });
            }
  
          }
  
  
        }
      });
  
    }else{
      User.findOne({
        phone: fields.loginInput
      }, function(err, found) {
        if (!err) {
          if(found){
            if(found.verified && found.hasPassword){
              if (found.password === fields.password) {
                console.log('"' + fields.loginInput+'"'+" login was successful!");
                req.session.userId = found.unique_id;
                console.log("Session created for"+'"' + fields.loginInput+'"');
  
                console.log("Redirecting "+'"' + fields.loginInput+'"'+" to home!");
                res.redirect("/");
              }
              if(found.password !== fields.password) {
                     console.log('"' + fields.loginInput+'"'+" entered the wrong password!");
                     res.render("login",{inputFouned:true,inputVerify:true,loginInput:fields.loginInput,newUser:true});
                   }
            }
            if(!found.hasPassword){
              if (fields.userType ==="Downloader")
              {
                console.log("he's a Downloader");
                User.updateMany({
                  phone: fields.loginInput
                }, {
                  type:"Downloader",
                  firstName:fields.firstName,
                  lastName:fields.lastName,
                  password: fields.password,
                  hasPassword:true
                }, function(err, docs) {
                  if (!err) {
                    console.log('"' + fields.loginInput+'"'+" now has a password!");
                    req.session.userId = found.unique_id;
                    console.log("Session created for"+'"' + fields.loginInput+'"');
                    console.log("Redirecting "+'"' + fields.loginInput+'"'+" to home!");
                    res.redirect("/");
                  }
                });
              }
              if (fields.userType ==="Uploader")
              {
                User.updateMany({
                  phone: fields.loginInput
                }, {
                  type:"Uploader",
                  firstName:fields.firstName,
                  lastName:fields.lastName,
                  userName:fields.userName,
                  instagram:fields.instagram,
                  twitter:fields.twitter,
                  bio:fields.bio,
                  password: fields.password,
                  hasPassword:true
                }, function(err, docs) {
                  if (!err) {
                    console.log('"' + fields.loginInput+'"'+" now has a password!");
                    req.session.userId = found.unique_id;
                    console.log("Session created for"+'"' + fields.loginInput+'"');
                    console.log("Redirecting "+'"' + fields.loginInput+'"'+" to home!");
                    res.redirect("/");
                  }
                });
              }
            }
            if(!found.verified){
              User.updateOne({
                phone: fields.loginInput
              }, {
                verifyCode: generateOTP.createNewOTP(),
              }, function(err, docs) {
                if (!err) {
                  console.log('"' + fields.loginInput+'"'+" verify code updated");
                }
                res.render("login",{inputVerify:false,inputFouned:false,loginInput:fields.loginInput,newUser:false});
              });
            }
  
          }
  
  
        }
      });
    }






    if (err) {
      next(err);
      return;
    }
  });
  
});


router.post("/upload", function(req, res){
  var c;
  User.findOne({unique_id: req.session.userId},
    function(err,found)
    {
      if(!err)
        if(found)
        {
          Product.findOne({}, {}, { sort: { "_id": -1 } },function(err,data)
          {
            if (data)
            {
              c = data.productId + 1;
            }
            else{
              c = 1;
            }
            const dir = __dirname + "/uploads/users/"+ found.unique_id +"/Products/" + c;
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, {
              recursive: true
            });
            }
            const form = formidable({ multiples: true, uploadDir: dir});
            form.keepExtensions=true;
            form.maxFileSize=10*1024*1024;
            form.parse(req, (err, fields, files) => {
              console.log(fields.type);
              const newProduct = new Product({
                productId:c,
                fileName:fields.fileName,
                tags:fields.tags,
                description:fields.description,
                orginalPrice:fields.orginalPrice,
                largePrice:fields.largePrice,
                mediumPrice:fields.mediumPrice,
                smallPrice:fields.smallPrice,
                user:found
              });
              newProduct.save();
              if (err) {
                next(err);
                return;
              }
              res.redirect("/");
            });

          });
          
        }
    });
});
// END OF POST ROUTE'S






module.exports = router;
