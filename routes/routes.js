var express = require('express');
var router = express.Router();
var User = require('../models/user');
const generateOTP = require("../localModules/generateOTP.js")


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


router.get("/upload",function(req,res){
  res.render("upload");
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
  if(req.body.loginInput.includes("@")===true){
    User.findOne({
      email: req.body.loginInput
    }, function(err, found) {
      if (!err) {
        if(found){
          if(found.verified && found.hasPassword){
            if (found.password === req.body.password) {
              console.log('"' + req.body.loginInput+'"'+" login was successful!");
              req.session.userId = found.unique_id;
              console.log("Session created for"+'"' + req.body.loginInput+'"');

              console.log("Redirecting "+'"' + req.body.loginInput+'"'+" to home!");
              res.redirect("/");
            }
            if(found.password !== req.body.password) {
                   console.log('"' + req.body.loginInput+'"'+" entered the wrong password!");
                   res.render("login",{inputFouned:true,inputVerify:true,loginInput:req.body.loginInput,newUser:true});
                 }
          }
          if(!found.hasPassword){
            User.updateMany({
              email: req.body.loginInput
            }, {
              firstName:req.body.firstName,
              lastName:req.body.lastName,
              password: req.body.password,
              hasPassword:true
            }, function(err, docs) {
              if (!err) {
                console.log('"' + req.body.loginInput+'"'+" now has a password!");
                req.session.userId = found.unique_id;
                console.log("Session created for"+'"' + req.body.loginInput+'"');
                console.log("Redirecting "+'"' + req.body.loginInput+'"'+" to home!");
                res.redirect("/");
              }
            });
          }
          if(!found.verified){
            User.updateOne({
              email: req.body.loginInput
            }, {
              verifyCode: generateOTP.createNewOTP(),
            }, function(err, docs) {
              if (!err) {
                console.log('"' + req.body.loginInput+'"'+" verify code updated");
              }
              res.render("login",{inputVerify:false,inputFouned:false,loginInput:req.body.loginInput,newUser:false});
            });
          }

        }


      }
    });

  }else{
    User.findOne({
      phone: req.body.loginInput
    }, function(err, found) {
      if (!err) {
        if(found){
          if(found.verified && found.hasPassword){
            if (found.password === req.body.password) {
              console.log('"' + req.body.loginInput+'"'+" login was successful!");
              req.session.userId = found.unique_id;
              console.log("Session created for"+'"' + req.body.loginInput+'"');

              console.log("Redirecting "+'"' + req.body.loginInput+'"'+" to home!");
              res.redirect("/");
            }
            if(found.password !== req.body.password) {
                   console.log('"' + req.body.loginInput+'"'+" entered the wrong password!");
                   res.render("login",{inputFouned:true,inputVerify:true,loginInput:req.body.loginInput,newUser:true});
                 }
          }
          if(!found.hasPassword){
            User.updateMany({
              phone: req.body.loginInput
            }, {
              firstName:req.body.firstName,
              lastName:req.body.lastName,
              password: req.body.password,
              hasPassword:true
            }, function(err, docs) {
              if (!err) {
                console.log('"' + req.body.loginInput+'"'+" now has a password!");
                req.session.userId = found.unique_id;
                console.log("Session created for"+'"' + req.body.loginInput+'"');
                console.log("Redirecting "+'"' + req.body.loginInput+'"'+" to home!");
                res.redirect("/");
              }
            });
          }
          if(!found.verified){
            User.updateOne({
              phone: req.body.loginInput
            }, {
              verifyCode: generateOTP.createNewOTP(),
            }, function(err, docs) {
              if (!err) {
                console.log('"' + req.body.loginInput+'"'+" verify code updated");
              }
              res.render("login",{inputVerify:false,inputFouned:false,loginInput:req.body.loginInput,newUser:false});
            });
          }

        }


      }
    });
  }
});

// END OF POST ROUTE'S






module.exports = router;
