var express = require('express');
var router = express.Router();
var User = require('../models/user');
var CreditCard = require('../models/creditCard');
var Product = require('../models/product');
var Message = require('../models/message');
var Discount = require('../models/discount');
var Cart = require("../cart");
var Order = require('../models/order');
const Jimp=require("jimp");

// const bodyParser=require("body-parser");
const { check, validationResult } = require('express-validator');

const fs = require("fs");
const generateOTP = require("../localModules/generateOTP.js");
const discountGenerator = require("../localModules/discountGenerator.js");
const smsPannel = require("../localModules/smsPannel.js");
const newDate = require("../localModules/date.js");
const formidable = require('formidable');
// const urlencodedParser =bodyParser.urlencoded({extended:false});
const path = require("path");
const user = require('../models/user');
const product = require('../models/product');
const date = require('../localModules/date.js');
require('dotenv').config();











// GET ROUTE'S

router.post("/generateD",function(req,res){
  var c;
  Discount.findOne({},function(err,data)
  {
    if (data)
    {
      c = data.unique_id + 1;
    }
    else{
      c = 1;
    }
  User.findOne({unique_id:req.session.userId},function(err,found){

    if(!err){
    if(found){
      const discount= new Discount({
        amount :req.body.amount,
        fromDate :req.body.fromDate,
        toDate :req.body.toDate,
        unique_id: c,
        userId:found.unique_id,
        code:discountGenerator.getDiscount().toString() ,
        date:new Date()

      });
      discount.save(function(err, docs) {
        if (!err) {
         console.log("message sent");
         let discountCreated={message:`discount code added`,code:"000",date:newDate(new Date())};
         User.updateOne({
           unique_id:req.session.userId
         },
         {
           $push:{message:discountCreated}
         },function(err){
           if(!err){
             console.log("added status");
           }
         });
         res.redirect("/dashboard");
        }
        else{
          console.log(err);
          res.redirect("/dashboard");
        }
      });


    }
  }
  });
}).sort({_id: -1}).limit(1);
  








});


router.post("/addFund",function(req,res){ 
  res.redirect("dashboard");
  
});

router.post("/getFund",function(req,res){
  res.redirect("dashboard");
  
});
router.post("/sendMessage",function(req,res){

  var c;
  Message.findOne({},function(err,data)
  {
    if (data)
    {
      c = data.unique_id + 1;
    }
    else{
      c = 1;
    }
  User.findOne({unique_id:req.session.userId},function(err,found){
    if(!err){
    if(found){
      const message = new Message({
        message:req.body.message,
        user:found,
        unique_id: c,
        date:new Date(),
        answered:false
      });
      message.save(function(err, docs) {
        if (!err) {
         console.log("message sent");
         let messageSent={message:`message sent`,code:"000",date:newDate(new Date())};
         User.updateOne({
           unique_id:req.session.userId
         },
         {
           $push:{message:messageSent}
         },function(err){
           if(!err){
             console.log("added status");
           }
         });
         res.redirect("/dashboard");
        }
        else{
          console.log(err);
          res.redirect("/dashboard");
        }
      });


    }
  }
  });
}).sort({_id: -1}).limit(1);
  
});



router.post("/addCard",function(req,res){

  User.updateOne({unique_id:req.session.userId},{creditCardConfirmation:"wait"},function(err){
    if(!err){
      console.log("waiting for confirmation");
    }
  });
  User.findOne({unique_id:req.session.userId},function(err,found){
    if(!err){
    if(found){
      const creditCard = new CreditCard({
        cardNumber:req.body.cardNumber,
        name:req.body.name,
        sId:req.body.sId,
        user:found,
        date:new Date(),
      });
      creditCard.save(function(err, docs) {
        if (!err) {
         console.log("credirCard added");
         let cardAdded={message:`card added`,code:"000",date:newDate(new Date())};
         User.updateOne({
           unique_id:req.session.userId
         },
         {
           $push:{message:cardAdded}
         },function(err){
           if(!err){
             console.log("added status");
           }
         });
         res.redirect("/dashboard");
        }
        else{
          console.log(err);
          res.redirect("/dashboard");
        }
      });


    }
  }
  });


});




router.get("/download/:productId/:size",function(req,res){
  if(req.session.userId){
    var size = req.params.size;
    var productId = req.params.productId;
    if(size == "original" || size == "large" || size == "medium" || size == "small"){
      Product.findOne({"_id":req.params.productId},function(err,product)
      {
        if(size == "original" && product.orginalPrice == 0)
        {
          res.download(product.filePath, function(error){
            if(error){
              console.log("Error : ", error)
            } 
        });
        }
        else if(size == "large" && product.largePrice == 0)
        {
          res.download(product.filePath, function(error){
            if(error){
              console.log("Error : ", error)
            } 
        });
        }
        else if(size == "medium" && product.mediumPrice == 0)
        {
          res.download(product.filePath, function(error){
            if(error){
              console.log("Error : ", error)
            } 
        });
        }
        else if(size == "small" && product.smallPrice == 0)
        {
          res.download(product.filePath, function(error){
            if(error){
              console.log("Error : ", error)
            } 
        });
        }
        else{
          User.findOne({unique_id:req.session.userId},{"products":{$elemMatch:{"product._id":req.params.productId,"size":req.params.size}}},function(err,found){
            if(!err){
              res.download(found.products[0].product.filePath, function(error){
                if(error){
                  console.log("Error : ", error)
                  
                }
                
            });
              
              // if(!found.downloaded.length){
              //   let download={product:req.params.productId,size:req.params.size};
              //   User.updateOne({
              //     unique_id:req.session.userId
              //   },
              //   {
              //     $push:{downloaded:download}
              //   },function(err){
              //     if(!err){
              //       console.log("success");
              //     }else{
              //       console.log(err);
              //     }
              //   });
      
              
              // }
            }
      
          });

        }

      });
      
    }
 
    
}else{
  res.redirect("/login");
}






  
});














router.get("/",function(req,res){
  Product.find({"confirmation":true}).limit(10).sort({downloadedCount: 'desc'})
    .exec(function(err, bestSales)
    {
      Product.find({"confirmation":true}).sort({rating: 'desc'})
      .exec(function(err, bestOfAll)
      {
        Product.find({"confirmation":true}).sort({dateAdded: 'desc'})
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










router.get("/tags/:tag",function(req,res){
  tagss ="#" + req.params.tag;
  console.log(tagss);
  Product.find({tags:{$in:tagss}})
  .exec(function(err,found){
    res.render("search",{searched:found,searchedItem:req.params.tag});
  });
});

router.get("/login",function(req,res){
  if (req.session.userId)
  {
    res.redirect("/dashboard")
  }else{
  res.render("login",{ inputFouned:false,inputVerify:true,loginInput:req.body.loginInput,newUser:false,back:true});
}
  });



router.get("/dashboard",function(req,res){
  if(req.session.userId)
  {
    User.findOne({
      unique_id: req.session.userId
    }, function(err, found) {
      if (found) {
        
        Product.find({"user.unique_id":found.unique_id})
        .exec(function(err,products){
          Order.find({"user.unique_id":req.session.userId},function(err,orders)
          {
            Discount.find({userId:req.session.userId},function(err,discounts){
              if(!err){
                if(discounts){
                Message.find({"user.unique_id":req.session.userId},function(err,messages){
                  if(!err){
                    res.render("dashboard",{user:found,searched:products,statusMessage:found.message,date:newDate(new Date()),orders:orders,discounts:discounts,messages:messages});
                  }

                });
                  

            
          }
        }
    });
          });
          
        });
      }
      else {
        res.render("notFound");
      }
    });
  }

});

router.get("/dashboard/orders/:orderId", function (req, res) {
    var orderId = req.params.orderId;
    if(req.session.userId)
    {
      Order.find({"orderId":orderId},function(err,order)
      {
        console.log(order[0]);
        if(order.length > 0)
        {
          res.render("order",{order:order[0]});
        }
        
      });
    }
    else{
      res.redirect('/login');
    }
   
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
      console.log(req.session.cart);
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
      res.render("notFound");
    }

  }
  else{
    res.redirect("/login");
  }

});


router.get("/orderConfirm",function(req, res)
{
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; 
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();

  var newdate = year + "/" + month + "/" + day;

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
            date:newdate,
            code:discountGenerator.getDiscount().toString()
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




  router.get("/edit/:uniqueId/:itemID/:itemName",function(req,res){
    if(req.session.userId==req.params.uniqueId){
      Product.find({$text:{$search:req.params.itemName}})
      // .skip(20)
      // .limit(10)
      .exec(function(err,searchedItem){
        Product.findOne({
          productId: req.params.itemID
        }, function(err, found) {
          if (found) {
              res.render("editProduct",{product:found});
              }
             else {
            res.render("notFound");
          }
  
        });

        
      });

    }else{
      res.render("notFound");
    }


  });



  router.get("/Product/:itemID/:itemName", function(req, res) {
    const link = req.params.itemID;
    Product.find({$text:{$search:req.params.itemName}})
    .exec(function(err,searchedItem){
       Product.findOne({
        productId: link
      }, function(err, found) {
        if (found && (found.confirmation || req.session.userId == 0)) {
            if(found.user.unique_id==req.session.userId){

              res.render("productDetail", {
                item:found,searched:searchedItem,admin:"true",size:"None"
              });
            }else{
              if(req.session.userId)
              {
                User.findOne({unique_id:req.session.userId},{"products":{$elemMatch:{"product.productId":found.productId}}},function(err,found1)
                {
                  if(found1.products.length > 0)
                  {
                    console.log(found1.products[0].size);
                    res.render("productDetail", {
                      item:found,searched:searchedItem,admin:"false",size:found1.products[0].size
                    });
                  }
                  else{
                    res.render("productDetail", {
                      item:found,searched:searchedItem,admin:"false",size:"None"
                    });
                  }
                    console.log(found1.products.length);
                });
              }
              else{
                res.render("productDetail", {
                  item:found,searched:searchedItem,admin:"false",size:"None"
                });

              }
              
              
            }
            }
           else {
          res.render("notFound");
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
        Product.find({"user.unique_id":found.unique_id})
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


router.post("/sendAgain",function(req,res){

  generateOTP.newOtp(req.body.phone);

});


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
                
              generateOTP.newOtp(req.body.loginInput);

              res.render("login",{inputFouned:false,inputVerify:false,loginInput:req.body.loginInput,newUser:false});
            }
          }
          if(!found.verified){
            console.log('"' + req.body.loginInput+'"'+" is not verified");

            generateOTP.newOtp(req.body.loginInput);
            

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
            let verification=generateOTP.createNewOTP();
  
            smsPannel.sendSMS(verification,req.body.loginInput);

            const user = new User({
              unique_id: c,
              phone: req.body.loginInput,
              verifyCode: verification,
              verified: "false",
              registered: "false",
              hasPassword:"false",
              date:new Date(),
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

    if (err) {
      next(err);
      return;
    }
  });

});
router.post("/signUpU",function(req, res){
  const dir =path.join(__dirname,"/../public/profilePic/users/");
  console.log(dir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
    recursive: true
  });
  }
  const form = formidable({ multiples: true, uploadDir: dir});
  form.keepExtensions=true;
  form.maxFileSize=10*1024*1024;
  form.parse(req, (err, fields, files) => {

      User.findOne({
        phone: fields.loginInput
      }, function(err, found) {

        if (!err) {
          if(found){
            if(!found.hasPassword){
              var profilePicPath = "";
              var fileName = path.basename(files.profilePic.path);
              var newPath = path.join("/profilePic/users/",fileName);

              if (files.profilePic.size != 0)
                  profilePicPath = newPath;
              else
                  profilePicPath = "no picture";

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
                profilePicPath:profilePicPath,
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
            const dir=__dirname+"/../uploads/users/"+found.unique_id +"/Products/" +c;
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, {
              recursive: true
            });
            }
            const editedImageDir=__dirname+"/../public/covers/users/"+found.unique_id +"/Products/" +c;
            if (!fs.existsSync(editedImageDir)) {
              fs.mkdirSync(editedImageDir, {
              recursive: true
            });
            }
            console.log(__dirname+"/../uploads/users/"+found.unique_id +"/Products/" +c)








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
              const fileName = path.basename(files.productCover.path);
              const databaseDestination = "covers/users/"+ found.unique_id +"/Products/" + c+"/"+fileName;
              const destination ="public/covers/users/"+ found.unique_id +"/Products/" + c+"/"+fileName;

              Jimp.read(files.productCover.path)
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
              console.log(fields.fileTypes.split('&').pop());
              var fileTypes = fields.fileTypes.split('&');
              fileTypes.pop();
              console.log("injaaaaaaaaaaaaaaaaaaaa");
              console.log(fileTypes);
              tagsarr = tagsarr.filter(function(e){return e});
              const newProduct = new Product({
                productId:c,
                type:fields.types,
                fileName:fields.fileName,
                tags:tagsarr,
                description:fields.description,
                filePath:files.productFiles.path,
                fileType:files.productFiles.type,
                fileTypes:fileTypes,
                coverPath:databaseDestination,
                orginalPrice:fields.orginalPrice,
                largePrice:fields.largePrice,
                mediumPrice:fields.mediumPrice,
                smallPrice:fields.smallPrice,
                user:found,
                date:new Date(),
                confirmation:false
               
              });
             
           


              newProduct.save();
              // found.products.push(newProduct);
              found.save();






              if (err) {
                next(err);
 
                let failedUpload={message:`${fields.fileName} upload failed`,code:"222",date:newDate(new Date())};
                User.updateOne({
                  unique_id:req.session.userId
                },
                {
                  $push:{message:failedUpload}
                },function(err){
                  if(!err){
                    console.log("added status");
                  }
                });
                return;
              }
              if(!err){
                let successfulUpload={message:`${fields.fileName} upload was succesfull`,code:"000",date:newDate(new Date())};
                User.updateOne({
                  unique_id:req.session.userId
                },
                {
                  $push:{message:successfulUpload}
                },function(err){
                  if(!err){
                    console.log("added status");
                  }
                });
              }
              res.redirect("/");
            });

          });

        }
    });









});







router.post("/editProduct/:productId",function(req,res,next){







            const form = formidable({ multiples: true});
            form.keepExtensions=true;
            form.maxFileSize=10*1024*1024;
            form.parse(req, (err, fields, files) => { 
  
              Product.findOne({productId:req.params.productId},function(err,found){
                if(!err){
                  if(found){
            
            
            
                    if(found.tags && !fields.tags){
                      tagsarr = fields.tags.split(" ");
                      for (var i = 0; i < tagsarr.length; i++)
                      {
                        if((tagsarr[i].includes("#") && tagsarr[i].length == 1) || !tagsarr[i].includes("#"))
                        {
                          delete tagsarr[i];
                        }
        
                      }
                      tagsarr = tagsarr.filter(function(e){return e});
        
                      Product.updateOne({
                        productId:req.params.productId
                      }, {
                        tags:fields.tags,
                      },function(err){
                        if(!err){
                          console.log("sucess!");
                        }
                      });
            
                  }
            if(fields.tags != found.tags && fields.tags){
              tagsarr = fields.tags.split(" ");
              for (var i = 0; i < tagsarr.length; i++)
              {
                if((tagsarr[i].includes("#") && tagsarr[i].length == 1) || !tagsarr[i].includes("#"))
                {
                  delete tagsarr[i];
                }

              }
              tagsarr = tagsarr.filter(function(e){return e});

              Product.updateOne({
                productId:req.params.productId
              }, {
                tags:tagsarr,
              },function(err){
                if(!err){

                  console.log("sucess!");
  
                }
              });


            }

            if(fields.fileName != found.fileName && fields.fileName){
    
              Product.updateOne({
                productId:req.params.productId
              }, {
                fileName:fields.fileName,
              },function(err){
                if(!err){

                  console.log("sucess!");
  
                }
              });


            }
            if(found.description && !fields.description){
              Product.updateOne({
                productId:req.params.productId
              }, {
                description:fields.description,
              },function(err){
                if(!err){
                  console.log("sucess!");
                }
              });
    
          }

            if(fields.description != found.description && fields.description){
    
              Product.updateOne({
                productId:req.params.productId
              }, {
                description:fields.description,
              },function(err){
                if(!err){

                  console.log("sucess!");
  
                }
              });


            }

            if(fields.orginalPrice != found.orginalPrice && fields.orginalPrice){
    
              Product.updateOne({
                productId:req.params.productId
              }, {
                orginalPrice:fields.orginalPrice,
              },function(err){
                if(!err){

                  console.log("sucess!");
  
                }
              });


            }


            if(fields.mediumPrice != found.mediumPrice && fields.mediumPrice){
    
              Product.updateOne({
                productId:req.params.productId
              }, {
                mediumPrice:fields.mediumPrice,
              },function(err){
                if(!err){

                  console.log("sucess!");
  
                }
              });


            }



            if(fields.largePrice != found.largePrice && fields.largePrice){
    
              Product.updateOne({
                productId:req.params.productId
              }, {
                largePrice:fields.largePrice,
              },function(err){
                if(!err){

                  console.log("sucess!");
  
                }
              });


            }
 

            if(fields.smallPrice != found.smallPrice && fields.smallPrice){
    
              Product.updateOne({
                productId:req.params.productId
              }, {
                smallPrice:fields.smallPrice,
              },function(err){
                if(!err){

                  console.log("sucess!");
  
                }
              });


            }


            if (err) {
              next(err);
              let failedUpload={message:`${fields.fileName} upload failed`,code:"222",date:newDate(new Date())};
              Product.updateOne({
                unique_id:req.session.userId
              },
              {
                $push:{message:failedUpload}
              },function(err){
                if(!err){
                  console.log("added status");
                }
              });
              return;
            }
            if(!err){
              Product.findOne({productId:req.params.productId},function(err,found){
                if(!err){
                  let successfulUpload={message:`${found.fileName} changed`,code:"111",date:newDate};
                  User.updateOne({
                    unique_id:req.session.userId
                  },
                  {
                    $push:{message:successfulUpload}
                  },function(err){
                    if(!err){
                      console.log("added status");
                    }
                  });
                }
              });
              res.redirect(`/Product/${found.productId}/${found.fileName}`);
            }




          }
        }
        });
        


          });






});





router.post("/changeUserInfoU",function(req,res,next){

 
  const dir =path.join(__dirname,"/../public/profilePic/users/");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
    recursive: true
  });
  }
  
  const form = formidable({ multiples: true, uploadDir: dir});
  form.keepExtensions=true;
  form.maxFileSize=10*1024*1024;
  form.parse(req, (err, fields, files) => {

      User.findOne({
        unique_id:req.session.userId
      }, function(err, found) {



        if (!err) {
          if(found){

            if(fields && fields.oldPassword==found.password){


              
              if(files.profilePic != found.profilePic && files.profilePic && files.profilePic.size!=0){

                console.log("true");
                var profilePicPath = "";
                var fileName = path.basename(files.profilePic.path);
                var newPath = path.join("/profilePic/users/",fileName);
  
                if (files.profilePic.size != 0)
                    profilePicPath = newPath;
                else
                    profilePicPath = "no picture";
  
                    const removeDir=path.join(__dirname,"/../public",found.profilePicPath);
                      fs.unlink(removeDir, (err) => {
                        if (err) {
                          console.error(err)
                          return
                        }
                      
                        console.log("file removed")
                      });
                    
              
                User.updateOne({
                  unique_id:req.session.userId
                }, {
                  profilePicPath:profilePicPath,
                },function(err){
                  if(!err){
                    let successfulProfilePicChange={message:`Profile picture updated`,code:"111",date:newDate(new Date())};
                    User.updateOne({
                      unique_id:req.session.userId
                    },
                    {
                      $push:{message:successfulProfilePicChange}
                    },function(err){
                      if(!err){
                        console.log("added status");
                      }
                    });
  
    
                    console.log("sucess!");
    
                  }
                });
                Product.updateMany({"user.unique_id":found.unique_id},{"user.prodilePicPath":fields.prodilePicPath},function(err){
                  if(!err){
                    console.log("products user updated");
                  }
              
                });


  
            }
  
  
            if(fields.firstName != found.firstName && fields.firstName){
              User.updateOne({
                unique_id:req.session.userId
              }, {
                firstName:fields.firstName,
              },function(err){
                if(!err){
                  let successfulNamechange={message:`FirstName changed from ${found.firstName} to ${fields.firstName}`,code:"111",date:newDate(new Date())};
                  User.updateOne({
                    unique_id:req.session.userId
                  },
                  {
                    $push:{message:successfulNamechange}
                  },function(err){
                    if(!err){
                      console.log("added status");
                    }
                  });
                  console.log("sucess!");
  
                }
              });
              Product.updateMany({"user.unique_id":found.unique_id},{"user.firstName":fields.firstName},function(err){
                if(!err){
                  console.log("products user updated");
                }
            
              });
            }if(fields.lastName != found.lastName && fields.lastName){
              User.updateOne({
                unique_id:req.session.userId
              }, {
                lastName:fields.lastName,
            },function(err){
              if(!err){
                let successfullLastNameChange={message:`LastName changed from ${found.lastName} to ${fields.lastName}`,code:"111",date:newDate(new Date())};
                    User.updateOne({
                      unique_id:req.session.userId
                    },
                    {
                      $push:{message:successfullLastNameChange}
                    },function(err){
                      if(!err){
                        console.log("added status");
                      }
                    });
  
                console.log("sucess!");
  
              }
            });
            Product.updateMany({"user.unique_id":found.unique_id},{"user.lastName":fields.lastName},function(err){
              if(!err){
                console.log("products user updated");
              }
          
            });
          }if(fields.userName != found.userName && fields.userName){
            User.findOne({userName:fields.userName.toLowerCase()},function(err,userNameFound){
              if(!err){
                if(userNameFound){
                  if(userNameFound.unique_id!=req.session.userId){
                    let unsuccessfullUserNameChange={message:`couldnt change username | ${fields.userName.toLowerCase()} already exists`,code:"222",date:newDate(new Date())};
                    User.updateOne({
                      unique_id:req.session.userId
                    },
                    {
                      $push:{message:unsuccessfullUserNameChange}
                    },function(err){
                      if(!err){
                        console.log("added status");
                      }
                    });
                  }
                }else{
                User.updateOne({
              unique_id:req.session.userId
            }, {
              userName:fields.userName.toLowerCase(),
          },function(err){
            if(!err){
              let successfullUserNameChange={message:`UserName changed from ${found.userName} to ${fields.userName}`,code:"111",date:newDate(new Date())};
                    User.updateOne({
                      unique_id:req.session.userId
                    },
                    {
                      $push:{message:successfullUserNameChange}
                    },function(err){
                      if(!err){
                        console.log("added status");
                      }
                    });
  
              console.log("sucess!");
  
            }
          });
                }
              }
            });
            Product.updateMany({"user.unique_id":found.unique_id},{"user.userName":fields.userName.toLowerCase()},function(err){
              if(!err){
                console.log("products user updated");
              }
          
            });
  
        }
        if(found.instagram && !fields.instagram){
            User.updateOne({
              unique_id:req.session.userId
            }, {
              instagram:fields.instagram,
            },function(err){
              if(!err){
                let successfulInstagramchange={message:`instagram link removed`,code:"111",date:newDate(new Date())};
                User.updateOne({
                  unique_id:req.session.userId
                },
                {
                  $push:{message:successfulInstagramchange}
                },function(err){
                  if(!err){
                    console.log("added status");
                  }
                });
                console.log("sucess!");
  
              }
            });
  
        }
        if(fields.instagram != found.instagram && fields.instagram){
          User.updateOne({
            unique_id:req.session.userId
          }, {
            instagram:fields.instagram,
        },function(err){
          if(!err){
            let successfullInstagramChange={message:`Instagram link updated`,code:"111",date:newDate(new Date())};
                    User.updateOne({
                      unique_id:req.session.userId
                    },
                    {
                      $push:{message:successfullInstagramChange}
                    },function(err){
                      if(!err){
                        console.log("added status");
                      }
                    });
            console.log("sucess!");
  
          }
        });
        Product.updateMany({"user.unique_id":found.unique_id},{"user.instagram":fields.instagram},function(err){
          if(!err){
            console.log("products user updated");
          }
      
        });
      }
      if(found.twitter && !fields.twitter){
        User.updateOne({
          unique_id:req.session.userId
        }, {
          twitter:fields.twitter,
        },function(err){
          if(!err){
            let successfulTwitterchange={message:`twitter link removed`,code:"111",date:newDate(new Date())};
            User.updateOne({
              unique_id:req.session.userId
            },
            {
              $push:{message:successfulTwitterchange}
            },function(err){
              if(!err){
                console.log("added status");
              }
            });
            console.log("sucess!");
  
          }
        });
  
    }
      if(fields.twitter != found.twitter && fields.twitter){
        User.updateOne({
          unique_id:req.session.userId
        }, {
          twitter:fields.twitter,
      },function(err){
        if(!err){
          let successfullTwitterChange={message:`Twitter link updated`,code:"111",date:newDate(new Date())};
          User.updateOne({
            unique_id:req.session.userId
          },
          {
            $push:{message:successfullTwitterChange}
          },function(err){
            if(!err){
              console.log("added status");
            }
          });
          console.log("sucess!");
  
        }
      });
      Product.updateMany({"user.unique_id":found.unique_id},{"user.twitter":fields.twitter},function(err){
        if(!err){
          console.log("products user updated");
        }
    
      });
    }
    if(found.bio && !fields.bio){
      User.updateOne({
        unique_id:req.session.userId
      }, {
        bio:fields.bio,
      },function(err){
        if(!err){
          let successfulBioChange={message:`bio removed`,code:"111",date:newDate(new Date())};
          User.updateOne({
            unique_id:req.session.userId
          },
          {
            $push:{message:successfulBioChange}
          },function(err){
            if(!err){
              console.log("added status");
            }
          });
          console.log("sucess!");
  
        }
      });
  
  }
    
    if(fields.bio != found.bio && fields.bio){
      User.updateOne({
        unique_id:req.session.userId
      }, {
        bio:fields.bio,
    },function(err){
      if(!err){
        let successfullBioChange={message:`bio updated`,code:"111",date:newDate(new Date())};
        User.updateOne({
          unique_id:req.session.userId
        },
        {
          $push:{message:successfullBioChange}
        },function(err){
          if(!err){
            console.log("added status");
          }
        });
        console.log("sucess!");
  
      }
    });
    Product.updateMany({"user.unique_id":found.unique_id},{"user.bio":fields.bio},function(err){
      if(!err){
        console.log("products user updated");
      }
  
    });
  }
  
  if(found.email && !fields.email){
    User.updateOne({
      unique_id:req.session.userId
    }, {
      email:fields.email,
    },function(err){
      if(!err){
        let successfulEmailchange={message:`email removed`,code:"111",date:newDate(new Date())};
        User.updateOne({
          unique_id:req.session.userId
        },
        {
          $push:{message:successfulEmailchange}
        },function(err){
          if(!err){
            console.log("added status");
          }
        });
        console.log("sucess!");
  
      }
    });
  
  }
  if(fields.email != found.email && fields.email){
    User.updateOne({
      unique_id:req.session.userId
    }, {
      email:fields.email,
  },function(err){
    if(!err){
      let successfullEmailChange={message:`Email updated`,code:"111",date:newDate(new Date())};
      User.updateOne({
        unique_id:req.session.userId
      },
      {
        $push:{message:successfullEmailChange}
      },function(err){
        if(!err){
          console.log("added status");
        }
      });
      console.log("sucess!");
  
    }
  });
  Product.updateMany({"user.unique_id":found.unique_id},{"user.email":fields.email},function(err){
    if(!err){
      console.log("products user updated");
    }

  });
  }if(fields.password && fields.passwordConfirmation && fields.password===fields.passwordConfirmation && fields.password != found.password){
    User.updateOne({
      unique_id:req.session.userId
    }, {
      password:fields.password,
  },function(err){
    if(!err){
      let successfullPasswordChange={message:`password changed`,code:"111",date:newDate(new Date())};
      User.updateOne({
        unique_id:req.session.userId
      },
      {
        $push:{message:successfullPasswordChange}
      },function(err){
        if(!err){
          console.log("added status");
        }
      });
      console.log("sucess!");
  
    }
  });
  Product.updateMany({"user.unique_id":found.unique_id},{"user.password":fields.password},function(err){
    if(!err){
      console.log("products user updated");
    }

  });
  
  }
        

            }else{
              let wrongPassword={message:`wrong password`,code:"222",date:newDate(new Date())};
              User.updateOne({
                unique_id:req.session.userId
              },
              {
                $push:{message:wrongPassword}
              },function(err){
                if(!err){
                  console.log("added status");
                }
              });

            }
            
        }
        }
      });


    if (err) {
      next(err);
      return;
    }
    if(!err){

      setTimeout(function(){ res.redirect("/dashboard"); }, 300);
      
    }
  });







});
router.post("/changeUserInfoD",function(req,res,next){
  const dir =path.join(__dirname,"/../public/profilePic/users/");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
    recursive: true
  });
  }
  
  const form = formidable({ multiples: true, uploadDir: dir});
  form.keepExtensions=true;
  form.maxFileSize=10*1024*1024;
  form.parse(req, (err, fields, files) => {

      User.findOne({
        unique_id:req.session.userId
      }, function(err, found) {

        if (!err) {
          if(found){
            if(fields && fields.oldPassword==found.password){
   



          if(fields.firstName != found.firstName && fields.firstName){
            User.updateOne({
              unique_id:req.session.userId
            }, {
              firstName:fields.firstName,
            },function(err){
              if(!err){
                let successfulNamechange={message:`FirstName changed from ${found.firstName} to ${fields.firstName}`,code:"111",date:newDate(new Date())};
                User.updateOne({
                  unique_id:req.session.userId
                },
                {
                  $push:{message:successfulNamechange}
                },function(err){
                  if(!err){
                    console.log("added status");
                  }
                });
                console.log("sucess!");

              }
            });
          }if(fields.lastName != found.lastName && fields.lastName){
            User.updateOne({
              unique_id:req.session.userId
            }, {
              lastName:fields.lastName,
          },function(err){
            if(!err){
              let successfullLastNameChange={message:`LastName changed from ${found.lastName} to ${fields.lastName}`,code:"111",date:newDate(new Date())};
                  User.updateOne({
                    unique_id:req.session.userId
                  },
                  {
                    $push:{message:successfullLastNameChange}
                  },function(err){
                    if(!err){
                      console.log("added status");
                    }
                  });

              console.log("sucess!");

            }
          });
        }if(fields.userName != found.userName && fields.userName){
          User.updateOne({
            unique_id:req.session.userId
          }, {
            userName:fields.userName.toLowerCase(),
        },function(err){
          if(!err){
            let successfullUserNameChange={message:`UserName changed from ${found.userName} to ${fields.userName}`,code:"111",date:newDate(new Date())};
                  User.updateOne({
                    unique_id:req.session.userId
                  },
                  {
                    $push:{message:successfullUserNameChange}
                  },function(err){
                    if(!err){
                      console.log("added status");
                    }
                  });

            console.log("sucess!");

          }
        });
      }
if(fields.password && fields.passwordConfirmation && fields.password===fields.passwordConfirmation && fields.password != found.password){
  User.updateOne({
    unique_id:req.session.userId
  }, {
    password:fields.password,
},function(err){
  if(!err){
    let successfullPasswordChange={message:`password changed`,code:"111",date:newDate(new Date())};
    User.updateOne({
      unique_id:req.session.userId
    },
    {
      $push:{message:successfullPasswordChange}
    },function(err){
      if(!err){
        console.log("added status");
      }
    });
    console.log("sucess!");

  }
});

}
}else{
  let wrongPassword={message:`wrong password`,code:"222",date:newDate(new Date())};
  User.updateOne({
    unique_id:req.session.userId
  },
  {
    $push:{message:wrongPassword}
  },function(err){
    if(!err){
      console.log("added status");
    }
  });

}
          
        }
        }
      });


    if (err) {
      next(err);
      return;
    }
    if(!err){
      setTimeout(function(){ res.redirect("/dashboard"); }, 200);
      
    }
  });







});




// searches



router.post("/search/home",function(req,res){
  if(req.body.searchedItem == "" || req.body.searchedItem == " ")
  {
    res.redirect("/");
  }
  else{
    res.redirect("/search/home/" + req.body.searchedItem);
  }

});


router.get("/search/home/:searchedItem",function(req,res){
//   Product.search(req.params.searchedItem, function(err, found) {
//     res.render("search",{searched:found});
//  });
Product.find({
  confirmation:true,
  $or: [
    { "fileName": new RegExp(req.params.searchedItem, "gi") },
    { "user.userName": new RegExp(req.params.searchedItem, "gi") },
    { "tags": new RegExp(req.params.searchedItem, "gi") },
    { "user.firstName": new RegExp(req.params.searchedItem, "gi") },
    { "fileType": new RegExp(req.params.searchedItem, "gi") },
    { "type": new RegExp(req.params.searchedItem, "gi") },
]
},function(err,found){
  if(found){
    console.log(found);
    res.render("search",{searched:found,searchedItem:req.params.searchedItem});
  }
  
});
}); 


//finances page search

router.post("/search/admin/finance",function(req,res){

    if(req.body.searchedItem == "" || req.body.searchedItem == " ")
    {
      res.redirect("/admin/finance");
    }
    else{
      res.redirect("/search/admin/finance/" + req.body.searchedItem);
    }  

  });
    

router.get("/search/admin/finance/:searchedItem",function(req,res){
//   Product.search(req.params.searchedItem, function(err, found) {
//     res.render("search",{searched:found});
//  });
if(req.session.userId == 0){
Order.find({
  $or: [
    { "products.fileName": new RegExp(req.params.searchedItem, "gi") },
    { "user.userName": new RegExp(req.params.searchedItem, "gi") },
    { "user.firstName": new RegExp(req.params.searchedItem, "gi") },
]
},function(err,found){
  res.render("adminFinanceSearch",{searched:found,date:newDate});
});
}else{
  res.redirect("/admin/login");
}
}); 

//users page search

router.post("/search/admin/users",function(req,res){

    if(req.body.searchedItem == "" || req.body.searchedItem == " ")
    {
      res.redirect("/admin/users");
    }
    else{
      res.redirect("/search/admin/users/" + req.body.searchedItem);
    }  

  });
    

router.get("/search/admin/users/:searchedItem",function(req,res){
//   Product.search(req.params.searchedItem, function(err, found) {
//     res.render("search",{searched:found});
//  });
if(req.session.userId == 0){
User.find({
  $or: [
    { "userName": new RegExp(req.params.searchedItem, "gi") },
    { "firstName": new RegExp(req.params.searchedItem, "gi") },
    { "lastName": new RegExp(req.params.searchedItem, "gi") },
    { "phone": new RegExp(req.params.searchedItem, "gi") },
    { "email": new RegExp(req.params.searchedItem, "gi") },
]
},function(err,found){
  res.render("adminUsersSearch",{searched:found,date:newDate});
});
}else{
  res.redirect("/admin/login");
}
}); 

//products page search

router.post("/search/admin/products",function(req,res){

    if(req.body.searchedItem == "" || req.body.searchedItem == " ")
    {
      res.redirect("/admin/products");
    }
    else{
      res.redirect("/search/admin/products/" + req.body.searchedItem);
    }  
 

  });
    

router.get("/search/admin/products/:searchedItem",function(req,res){
//   Product.search(req.params.searchedItem, function(err, found) {
//     res.render("search",{searched:found});
//  });
if(req.session.userId == 0){
Product.find({
  $or: [
    { "fileName": new RegExp(req.params.searchedItem, "gi") },
    { "user.userName": new RegExp(req.params.searchedItem, "gi") },
    { "tags": new RegExp(req.params.searchedItem, "gi") },
    { "user.firstName": new RegExp(req.params.searchedItem, "gi") },
    { "fileType": new RegExp(req.params.searchedItem, "gi") },
    { "type": new RegExp(req.params.searchedItem, "gi") },
]
},function(err,found){
  res.render("adminProductsSearch",{searched:found,date:newDate});
});
}else{
  res.redirect("/admin/login");
}
}); 

//messages page search

router.post("/search/admin/messages",function(req,res){

    if(req.body.searchedItem == "" || req.body.searchedItem == " ")
    {
      res.redirect("/admin/messages");
    }
    else{
      res.redirect("/search/admin/messages/" + req.body.searchedItem);
    }  

  });
    

router.get("/search/admin/messages/:searchedItem",function(req,res){
//   Product.search(req.params.searchedItem, function(err, found) {
//     res.render("search",{searched:found});
//  });
if(req.session.userId == 0){
Message.find({
  $or: [
    { "message": new RegExp(req.params.searchedItem, "gi") },
    { "title": new RegExp(req.params.searchedItem, "gi") },
    { "response": new RegExp(req.params.searchedItem, "gi") },
    { "user.firstName": new RegExp(req.params.searchedItem, "gi") },
    { "user.lastName": new RegExp(req.params.searchedItem, "gi") },
    { "user.userName": new RegExp(req.params.searchedItem, "gi") },
    
]
},function(err,found){
  res.render("adminMessagesSearch",{searched:found,date:newDate});
});
}else{
  res.redirect("/admin/login");
}
}); 














///////////////////////// ADMIN ROUTES ////////////////////////
router.get("/admin/home", function (req, res) {
  if(req.session.userId == 0){
    res.render("adminHome");
    
  }else{
    res.redirect("/admin/login");
  }
    
});

router.get("/admin/login", function (req, res) {
  if(req.session.userId==0){
    res.redirect("/admin/home");
  }
  else{
    res.render("adminLogin");

  }
  
});

router.post("/admin/login", function (req, res) {
  if(req.body.adminUser ==process.env.ADMIN_USER && req.body.password ==process.env.ADMIN_PASSWORD)
  {
    req.session.userId = 0;
    console.log("admin logged in");
    res.redirect("/admin/home")
  }
  
})





router.get("/admin/finance", function (req, res) {
  if(req.session.userId==0){
    Order.find({},function(err,orders)
    {
      res.render("adminFinance",{orders:orders,date:newDate});
    });
  }
  else{
    res.redirect("/admin/login")
  }
  
});



router.get("/admin/users", function (req, res) {
  if(req.session.userId==0){
    User.find({"type":"Uploader"},function(err,uploader){
      User.find({"type":"Downloader"},function(err,downloader)
      {
        res.render("adminUsers",{uploader:uploader,downloader:downloader,date:newDate});
      });

  
      
    });
  }
  else{
    res.redirect("/admin/login")
  }
  
});
router.post("/delete/user/:unique_id",function(req,res){
  User.deleteOne({unique_id:req.params.unique_id},function(err){
    if(!err){
          res.redirect("/admin/users");
    }
  });

  
});


router.get("/admin/messages", function (req, res) {
  if(req.session.userId==0){
    Message.find({answered:true},function(err,rMessages){
      Message.find({answered:false},function(err,messages){
  
      res.render("adminMessages",{messages:messages,rMessages:rMessages,date:newDate});
      });
    });
  }
  else{
    res.redirect("/admin/login");
  }
});
router.post("/send/message/:messageId/:userId",function(req,res){
  
  Message.updateOne({unique_id:req.params.messageId},{response:req.body.response,answered:true,answeredDate:new Date},function(err){
    if(!err){
      let messageRecieved={message:`you have recieved a new message`,code:"000",date:newDate(new Date())};
      User.updateOne({unique_id:req.params.userId },{$push:{message:messageRecieved}},function(err){
        if(!err){
          console.log("added status");
          res.redirect("/admin/messages");
        }
      });
      

    }

     

  });

});




router.get("/admin/reqs", function (req, res) {
  if(req.session.userId==0)
  {
    res.render("adminReq");
  }
  else{
    res.redirect("/admin/login")
  }
    
});


router.get("/admin/products", function (req, res) {
  if(req.session.userId==0)
  {
    Product.find({confirmation:false},function(err,uProducts)
    {
      Product.find({confirmation:true},function(err,cProducts)
      {
      res.render("adminProducts",{unconfirmedProducts:uProducts,confirmedProducts:cProducts,date:newDate});
      });
    });
  }
  else{
    res.redirect("/admin/login")
  }
  
});

router.post("/confirm/product/:productId",function(req,res){
  Product.updateOne({productId:req.params.productId},{confirmation:true,date:new Date()},function(err){
    if(!err){
      res.redirect("/admin/products");
    }
  });
});
router.post("/delete/product/:productId",function(req,res){
  Product.deleteOne({productId:req.params.productId},function(err){
    if(!err){
          res.redirect("/admin/products");

    }
  });
});
///////////////////////// ADMIN ROUTES ////////////////////////


router.get('*', function(req, res) {
  res.render("notFound");
});




module.exports = router;
