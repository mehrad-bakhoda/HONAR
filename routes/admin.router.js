const {default:AdminBro}=require("admin-bro");
const {buildAuthenticatedRouter}=require("admin-bro-expressjs");
const express =  require("express");
const argon2=require("argon2");
const session=require("express-session");
const mongoose=require("mongoose");
const MongoStore=require("connect-mongo")(session);
require('dotenv').config();
const User=require("./../models/user");
const Product=require("./../models/product");
const ADMIN={
  email:process.env.ADMIN_EMAIL,
  password:process.env.ADMIN_PASSWORD,
}

/**
* @param {adminBro} adminBro
* @return {express.Router} router
*/
const buildAdminRouter=(admin) => {
  const router=buildAuthenticatedRouter(admin,{
    cookieName:"admin-bro",
    cookiePassword:"superlongandcomplicatedname",
    authenticate:async(email,password)=>{
      if(ADMIN.email === email && ADMIN.password === password){
        return ADMIN;
      }
      return null;
    },
  },null,{
    resave:false,
    saveUninitialized:true,
    store:new MongoStore({mongooseConnection:mongoose.connection}),
  });
  return router;
};

module.exports=buildAdminRouter;
