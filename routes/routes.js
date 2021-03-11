var express = require('express');
var router = express.Router();
var User = require('../models/user');


// GET ROUTE'S

router.get("/",function(req,res){
    res.render("home");
  });
router.get("/start",function(req,res){
  if(req.session.userId === undefined)
{
  res.render("login");
}
else{
  res.redirect("dashboard")
}

});
router.get("/login",function(req,res){
    res.render("login");
  });
router.get("/dashboard",function(req,res){
    res.render("dashboard");
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




// END OF POST ROUTE'S






module.exports = router;
