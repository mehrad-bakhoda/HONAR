var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Product = require('../models/product');
var Cart = require("../cart");
var Order = require('../models/order');
const Jimp=require("jimp");
// const bodyParser=require("body-parser");
const { check, validationResult } = require('express-validator');

const fs = require("fs");
const generateOTP = require("../localModules/generateOTP.js");
const formidable = require('formidable');
// const urlencodedParser =bodyParser.urlencoded({extended:false});
const path = require("path");



// GET ROUTE'S


router.get("/",function(req,res){
  Product.find({}).limit(10).sort({downloadedCount: 'desc'})
    .exec(function(err, bestSales)
    {
      Product.find({}).sort({rating: 'desc'})
      .exec(function(err, bestOfAll)
      {
        Product.find({}).sort({dateAdded: 'desc'})
        .exec(function(err, latest)
        {

      if(req.session.userId){
        User.findOne({
          unique_id:req.session.userId
        },function(err,found){
          if(!err){
            if(found){
              res.render("home",{loggedIn:true,bestOfAll:bestOfAll,bestSales:bestSales,latest:latest});
            }
          }
        });
      }
      else{
        res.render("home",{loggedIn:false,bestOfAll:bestOfAll,bestSales:bestSales,latest:latest});
      }


    });
    });
    });
  });


router.get("/search/:searchedItem",function(req,res){

  Product.find({$text:{$search:req.params.searchedItem}})
  // .skip(20)
  // .limit(10)
  .exec(function(err,found){
    res.render("search",{searched:found});
  });
});


router.get("/tags/:tag",function(req,res){
  tagss ="#" + req.params.tag;
  console.log(tagss);
  Product.find({tags:{$in:tagss}})
  .exec(function(err,found){
    res.render("search",{searched:found});
  });
});

router.get("/login",function(req,res){
  if (req.session.userId)
  {
    res.redirect("/dashboard")
  }
  res.render("login",{ inputFouned:false,inputVerify:true,loginInput:req.body.loginInput,newUser:false,back:true});
  });



router.get("/dashboard",function(req,res){
  if(req.session.userId)
  {
    User.findOne({
      unique_id: req.session.userId
    }, function(err, found) {
      if (found) {
        Product.find({"user.userName":found.userName})
        .exec(function(err,products){
          res.render("dashboard",{user:found,searched:products});
        });
      }
      else {
        res.render("notFound");
      }
    });
  }

});

router.get("/order", function (req, res) {
    res.render("order");
});
router.get("/orders", function (req, res) {
    res.render("orders");
});

router.get("/user", function (req, res) {
    res.render("user");
});



router.get("/upload",function(req,res){
  if(req.session.userId){
    User.findOne({unique_id:req.session.userId},function(err,user){
      if(user.type == "Uploader")
        res.render("upload");
      else{
        res.redirect("/dashboard");
      }

    });

  }
  else{
    res.redirect("/login");
  }

  });


router.get("/contact-us",function(req,res){
    res.render("contactUs");
  });


router.get("/cart", function(req,res)
{
  if(!req.session.userId)
  {
    res.redirect("/login");
  }
  var cart = new Cart(req.session.cart || {});
  res.render("cart",{products:cart.generateArray(),totalPrice:cart.totalPrice,totalQty:cart.totalQty});
});

router.get("/delete-from-cart/:id",function(req,res){
  if(req.session.userId)
  {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.delete(productId);
    req.session.cart = cart;
    req.session.save();
    res.redirect('/cart');
  }

});
router.get("/add-to-cart/:id/:size", function(req, res){
  if(req.session.userId)
  {
    var productId = req.params.id;
    var size = req.params.size;
    if(size == "original" || size == "large" || size == "medium" || size == "small")
    {
      var cart = new Cart(req.session.cart ? req.session.cart : {});
      let product = Product.findOne({
        _id: productId
      }, function(err, product) {
        if(err){
          console.log("item adding failed");
          return
        }
        cart.add(product,product.productId,size);
        req.session.cart = cart;
        req.session.save();
        res.redirect('/cart');
    });
    }
    else{
      res.render("error404");
    }

  }
  else{
    res.redirect("/login");
  }

});

router.get("/orderConfirm",function(req, res)
{
  if(req.session.userId)
  {
    User.findOne({
      unique_id: req.session.userId
    }, function(err, found){
      if(found)
      {

        if(req.session.cart)
        {
          const cart =new Cart(req.session.cart).generateArray();
          console.log(cart.length);
          const order = new Order({
            user:found,
            quantity:req.session.cart.totalQty,
            totalPrice:req.session.cart.totalPrice,
          });
          for(var i = 0; i < cart.length;i++)
          {
            var product = {
               product:cart[i].item,
               size:cart[i].size
            }
            console.log(product);
            order.products.push(product);
            found.products.push(product);
          }
          order.save();
          found.save();
          req.session.cart = null;
          req.session.save();
          res.redirect("/cart")
        }

      }
      else{
        res.redirect("/login");
      }

    });

  }
})


router.get("/about-us",function(req,res){
    res.render("aboutUs");
  });


  router.get("/Product/:itemID/:itemName", function(req, res) {
    const link = req.params.itemID;
    Product.find({$text:{$search:req.params.itemName}})
    // .skip(20)
    // .limit(10)
    .exec(function(err,searchedItem){
       Product.findOne({
        productId: link
      }, function(err, found) {
        if (found) {
          res.render("productDetail", {
            item:found,searched:searchedItem
          });
        } else {
          res.render("error404");
        }

      });

    });


});

router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session.userId) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/');
    	}
    });
}
});


router.get("/:userName",function(req,res){
  if(req.params.userName.toLowerCase() != "logout")
  {
    User.findOne({
      userName: req.params.userName.toLowerCase()
    }, function(err, found) {
      if (found) {
        Product.find({"user.userName":found.userName})
        .exec(function(err,products){
          res.render("user",{user:found,searched:products});
        });
      }
      else {
        res.render("notFound");
      }
    });
  }


});




// END OF GET ROUTE'S



// POST ROUTE's


router.post("/login",[
  check('loginInput','phoneNumber').isMobilePhone().isLength({min:11 , max:11}).not().isEmpty(),
],(req,res,next)=>{
  const errors=validationResult(req).array();
  if(errors.length != 0)
  {
    req.session.errors = errors;
    res.redirect("/login");
    return next();
  }

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
          req.session.errors = [{value:verifyCode,msg:"Wrong verifyCode",param:"verifyCode"}];
          res.render("login",{inputVerify:false,inputFouned:false,loginInput:req.body.loginInput,newUser:false});
          req.session.errors = null;
          req.session.save();
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

router.post("/signUpD",function(req,res)
{
  const form = formidable({ multiples: true});
  form.keepExtensions=true;
  form.maxFileSize=10*1024*1024;
  form.parse(req, (err, fields, files) => {
    console.log(check(fields.firstName).not().isEmpty());

    const errors=validationResult(req).array();
    if(errors.length != 0)
    {
      req.session.errors = errors;
      res.redirect("/login");
      return next();
    }
    console.log(files.profilePic);
    if(fields.loginInput.includes("@")===true){
      User.findOne({
        email: fields.loginInput
      }, function(err, found) {
        if (!err) {
          if(found){
            if(!found.hasPassword){
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
                    req.session.save();
                    console.log("Session created for"+'"' + fields.loginInput+'"');
                    console.log("Redirecting "+'"' + fields.loginInput+'"'+" to home!");
                    res.redirect("/");
                  }
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
            if(!found.hasPassword){
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
                  req.session.save();
                  console.log("Session created for"+'"' + fields.loginInput+'"');
                  console.log("Redirecting "+'"' + fields.loginInput+'"'+" to home!");
                  res.redirect("/");
                }
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
router.post("/signUpU",function(req, res){
  var dir ="public/covers/users/";
  const form = formidable({ multiples: true, uploadDir: dir});
  form.keepExtensions=true;
  form.maxFileSize=10*1024*1024;
  form.parse(req, (err, fields, files) => {

    console.log(files.profilePic);
    if(fields.loginInput.includes("@")===true){
      User.findOne({
        email: fields.loginInput
      }, function(err, found) {
        if (!err) {
          if(found){
            if(!found.hasPassword){
              var profilePicPath = "";
              var fileName = (files.profilePic.path).substring(20);
              console.log(fileName);
              var oldPath =files.profilePic.path;
              var newPath = "public/covers/users/" + found.unique_id + "/" + fileName;
              const dir = "public/covers/users/" + found.unique_id
              if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, {
                recursive: true
              });
              }
              if (files.profilePic.size != 0)
                  profilePicPath = newPath.substring(7);
              else
                  profilePicPath = "no picture";
              fs.rename(oldPath,newPath,function(err)
              {
                if(err) throw err
                console.log("successfully");


              });
              User.updateMany({
                email: fields.loginInput
              }, {
                type:"Uploader",
                firstName:fields.firstName,
                lastName:fields.lastName,
                userName:fields.userName.toLowerCase(),
                instagram:fields.instagram,
                twitter:fields.twitter,
                bio:fields.bio,
                profilePhotoLocation:profilePicPath,
                password: fields.password,
                hasPassword:true
              }, function(err, docs) {
                if (!err) {
                  console.log('"' + fields.loginInput+'"'+" now has a password!");
                  req.session.userId = found.unique_id;
                  req.session.save();
                  console.log("Session created for"+'"' + fields.loginInput+'"');
                  console.log("Redirecting "+'"' + fields.loginInput+'"'+" to home!");
                  res.redirect("/");
                }
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
            if(!found.hasPassword){
              var profilePicPath = "";
              var fileName = (files.profilePic.path).substring(20);
              console.log(fileName);
              var oldPath =files.profilePic.path;
              var newPath = "public/covers/users/" + found.unique_id + "/" + fileName;
              const dir = "public/covers/users/" + found.unique_id
              if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, {
                recursive: true
              });
              }
              if (files.profilePic.size != 0)
                  profilePicPath = newPath.substring(7);
              else
                  profilePicPath = "no picture";
              fs.rename(oldPath,newPath,function(err)
              {
                if(err) throw err
                console.log("successfully");


              });
              User.updateMany({
                phone: fields.loginInput
              }, {
                type:"Uploader",
                firstName:fields.firstName,
                lastName:fields.lastName,
                userName:fields.userName.toLowerCase(),
                instagram:fields.instagram,
                twitter:fields.twitter,
                bio:fields.bio,
                profilePhotoLocation:profilePicPath,
                password: fields.password,
                hasPassword:true
              }, function(err, docs) {
                if (!err) {
                  console.log('"' + fields.loginInput+'"'+" now has a password!");
                  req.session.userId = found.unique_id;
                  req.session.save();
                  console.log("Session created for"+'"' + fields.loginInput+'"');
                  console.log("Redirecting "+'"' + fields.loginInput+'"'+" to home!");
                  res.redirect("/");
                }
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
router.post("/signIn"
// check('passwordConfirmation').not().isEmpty().isLength({min:8}).custom((value,{req}) =>{
//   if(value != req.body.password){
//     throw new Error("Password confirmation does not match password");
//   }
//   return true;
//
// }),



,(req, res)=> {
const errors=validationResult(req);
if(errors.isEmpty()){
  console.log(errors);
}

  var dir ="public/covers/users/";
  const form = formidable({ multiples: true, uploadDir: dir});
  form.keepExtensions=true;
  form.maxFileSize=10*1024*1024;
  form.parse(req, (err, fields, files) => {

    console.log(files.profilePic);
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
                req.session.save();
                console.log("Session created for"+'"' + fields.loginInput+'"');

                console.log("Redirecting "+'"' + fields.loginInput+'"'+" to home!");
                res.redirect("/");
              }
              if(found.password !== fields.password) {
                     console.log('"' + fields.loginInput+'"'+" entered the wrong password!");
                     req.session.errors = [{value:fields.password,msg:"Wrong Password",param:"password"}];
                     res.render("login",{inputFouned:true,inputVerify:true,loginInput:fields.loginInput,newUser:false});
                     req.session.errors = null;
                     req.session.save();
                   }
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
                req.session.save();
                console.log("Session created for"+'"' + fields.loginInput+'"');

                console.log("Redirecting "+'"' + fields.loginInput+'"'+" to home!");
                res.redirect("/");
              }
              if(found.password !== fields.password) {
                     console.log('"' + fields.loginInput+'"'+" entered the wrong password!");
                     req.session.errors = [{value:fields.password,msg:"Wrong Password",param:"password"}];
                     res.render("login",{inputFouned:true,inputVerify:true,loginInput:fields.loginInput,newUser:false});
                     req.session.errors = null;
                     req.session.save();

                   }
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
            const dir = "./uploads/users/"+ found.unique_id +"/Products/" + c;
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, {
              recursive: true
            });
            }

            const editedImageDir="public/covers/users/"+ found.unique_id +"/Products/" + c;
            if (!fs.existsSync(editedImageDir)) {
              fs.mkdirSync(editedImageDir, {
              recursive: true
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






            const form = formidable({ multiples: true, uploadDir: dir});
            form.keepExtensions=true;
            form.maxFileSize=10*1024*1024;
            form.parse(req, (err, fields, files) => {
              const fileName = path.basename(files.productFiles.path);
              const databaseDestination = "covers/users/"+ found.unique_id +"/Products/" + c+"/"+fileName;
              const destination ="public/covers/users/"+ found.unique_id +"/Products/" + c+"/"+fileName;

              Jimp.read(files.productFiles.path)
              .then(image =>{
                image.gaussian(1);
                image.quality(50);
                Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(font => {
                image.print(font, 0, 0, "@ART APP");
              });
                image.write(destination);
              })
              .catch(err =>{
                console.log(err);
              });

              tagsarr = fields.tags.split(" ");
              for (var i = 0; i < tagsarr.length; i++)
              {
                if((tagsarr[i].includes("#") && tagsarr[i].length == 1) || !tagsarr[i].includes("#"))
                {
                  delete tagsarr[i];
                }
              }
              tagsarr = tagsarr.filter(function(e){return e});
              console.log(files);
              const newProduct = new Product({
                productId:c,
                type:fields.types,
                fileName:fields.fileName,
                tags:tagsarr,
                description:fields.description,
                filePath:files.productFiles.path,
                fileType:files.productFiles.type,
                coverPath:databaseDestination,
                orginalPrice:fields.orginalPrice,
                largePrice:fields.largePrice,
                mediumPrice:fields.mediumPrice,
                smallPrice:fields.smallPrice,
                user:found,
                dateAdded:new Date()
              });
              newProduct.save();
              found.products.push(newProduct);
              found.save();





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
router.post("/changeUserInfo",function(req,res){
  User.findOne({unique_id: req.session.userId},
    function(err,found)
    {
      if(!err)
        if(found)
        {



            const dir = "./uploads/profilePic/users/"+ found.unique_id;
              fs.mkdirSync(dir, {
              recursive: true
            });

            const form = formidable({ multiples: true, uploadDir: dir});
            form.keepExtensions=true;
            form.maxFileSize=10*1024*1024;
            form.parse(req, (err, fields, files) => {
              console.log(req.session.userId);

              if(fields.lastName!==null && fields.lastName!==""){
              User.updateOne({
                unique_id:req.session.userId
              },{lastName:fields.lastName},function(err,doc){
                if(!err){console.log("successfly changed ");}
              });

            }
            if(fields.firstName!==null){
            User.updateOne({
              unique_id:req.session.userId
            },{firstName:fields.firstName},function(err,doc){
              if(!err){console.log("successfly changed ");}
            });

          }
          if(fields.userName!==null){
          User.updateOne({
            unique_id:req.session.userId
          },{userName:fields.userName},function(err,doc){
            if(!err){console.log("successfly changed ");}
          });

        }
        if(fields.email!==null){
        User.updateOne({
          unique_id:req.session.userId
        },{email:fields.email},function(err,doc){
          if(!err){console.log("successfly changed ");}
        });

      }
      if(fields.instagram!==null){
      User.updateOne({
        unique_id:req.session.userId
      },{instagram:fields.instagram},function(err,doc){
        if(!err){console.log("successfly changed ");}
      });

    }
    if(fields.twitter!==null){
    User.updateOne({
      unique_id:req.session.userId
    },{twitter:fields.twitter},function(err,doc){
      if(!err){console.log("successfly changed ");}
    });

  }
  if(fields.bio!==null){
  User.updateOne({
    unique_id:req.session.userId
  },{bio:fields.bio},function(err,doc){
    if(!err){console.log("successfly changed ");}
  });

}
if(fields.password!==null && fields.passwordConfirmation !==null && fields.password===fields.passwordConfirmation){
User.updateOne({
  unique_id:req.session.userId
},{password:fields.password},function(err,doc){
  if(!err){console.log("successfly changed ");}
});

}

            User.updateOne({
              unique_id:req.session.userId
            },{profilePicPath:files.profilePic.path},function(err,doc){
              if(!err){console.log("successfly changed ");}
            });
          });







}
          });




res.redirect("/dashboard");


});


router.post("/search",function(req,res){
  if(req.body.searchedItem == "")
  {
    res.redirect("/");
  }
  else{
    res.redirect("/search/" + req.body.searchedItem);
  }

});

// END OF POST ROUTE'S






module.exports = router;
