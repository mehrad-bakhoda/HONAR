//Modules

//Public Modules
var express = require("express");
require("dotenv").config();

//Database models
var Product = require("../../../models/product");
var Discount = require("../../../models/discount");
var Cart = require("../../../cart");

//Code

export default(req,res)=>{
     
  if(req.session.userId){

    var cart = new Cart(req.session.cart || {});

  if(req.query.discountCode){
    
  Discount.findOne({code:req.query.discountCode},async(err,dCode)=>{
    if(!err){
      if(dCode){

        let itemCounter=0;
        Object.keys(cart.items).forEach((key)=>{
         Product.findOne({productId:key},(err,product)=>{
           if(err){
            console.log(err);
            res.redirect("/cart");
           }
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
    }else{
      console.log(err);
      res.redirect("/cart");
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
  }else{
      res.redirect("/login");
  }
  

  


};